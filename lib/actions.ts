"use server";
import { NotificationType, Post, User } from "@/app/generated/prisma/client";
import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { PostDataType } from "@/types";
import { revalidatePath } from "next/cache";
import { NotificationDataType } from "@/types/notification";

// auth
const checkAuthServer = async () => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const getAuth = async () => {
  const auth = await checkAuthServer();

  return auth;
};

export const getAuthUnreadCounts = async () => {
  const auth = await checkAuthServer();
  const [unreadNotifications] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: auth.id,
        read: false,
      },
    }),
    // prisma.message.count({
    //   where: {
    //     recipientId: auth.id,
    //     read: false,
    //   },
    // }),
  ]);

  return {
    unreadNotifications,
    unreadMessages: 0,
  };
};

export const updateAuth = async (data: Partial<User>) => {
  const auth = await checkAuthServer();

  const user = await prisma.user.update({
    where: {
      id: auth.id,
    },
    data: data,
  });

  revalidatePath("/", "layout");
  return user;
};

export const getOptionalAuth = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  return await prisma.user.findUnique({
    where: { clerkId },
  });
};
// user
export const getUserByUsername = async (username: string) => {
  const getUser = await getOptionalAuth();
  const authId = getUser?.id;

  const [user, totalPosts, totalFollowers, totalFollowings, isFollowing] =
    await Promise.all([
      await prisma.user.findUnique({ where: { username } }),
      await prisma.post.count({ where: { author: { username } } }),
      await prisma.follow.count({ where: { following: { username } } }),
      await prisma.follow.count({ where: { follower: { username } } }),
      await prisma.follow.findFirst({
        where: {
          following: {
            username: username,
          },
          followerId: authId,
        },
      }),
    ]);

  return {
    user,
    totalPosts,
    totalFollowers,
    totalFollowings,
    isFollowing: !!isFollowing,
  };
};
export const toggleFollow = async (userId: string) => {
  const auth = await checkAuthServer();
  if (auth.id === userId) {
    throw new Error("You cannot follow yourself");
  }

  const checked = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: auth.id,
        followingId: userId,
      },
    },
  });

  let notifi;
  if (checked) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: auth.id,
          followingId: userId,
        },
      },
    });
  } else {
    const follow = await prisma.follow.create({
      data: { followerId: auth.id, followingId: userId },
    });

    if (follow.followingId !== auth.id) {
      notifi = await createNotification({
        issuerId: auth.id,
        recipientId: userId,
        type: "FOLLOW",
      });
    }
  }

  revalidatePath("/", "layout");

  return notifi;
};

// post
export const getPosts = async (username?: string): Promise<PostDataType[]> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const posts = await prisma.post.findMany({
    ...(username && {
      where: {
        author: {
          username: username,
        },
      },
    }),
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
          likes: true,
        },
      },
      likes: {
        where: { authorId: authId },
      },
      bookmarks: {
        where: { authorId: authId },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    ...post,
    isLiked: !!authId && post.likes?.length > 0,
    isBookmarked: !!authId && post.bookmarks?.length > 0,
    isShared: !!authId && true,
    _count: {
      ...post._count,
      comments: 10,
      shares: 40,
    },

    likes: undefined,
    bookmarks: undefined,
  }));
};
export const createPost = async (data: Partial<Post>) => {
  const auth = await checkAuthServer();

  const newPost = await prisma.post.create({
    data: {
      ...data,
      authorId: auth.id,
    },
  });
  revalidatePath("/", "layout");
  return newPost;
};
export const toggleLike = async (postId: string) => {
  const auth = await checkAuthServer();
  const checked = await prisma.like.findUnique({
    where: {
      authorId_postId: { authorId: auth.id, postId: postId },
    },
  });

  let notifi;

  if (checked) {
    await prisma.like.delete({
      where: {
        authorId_postId: { authorId: auth.id, postId: postId },
      },
    });
  } else {
    const like = await prisma.like.create({
      data: { authorId: auth.id, postId: postId },
      include: {
        post: true,
      },
    });

    if (like.post.authorId !== auth.id) {
      notifi = await createNotification({
        issuerId: auth.id,
        recipientId: like.post.authorId,
        type: "LIKE",
      });
    }
  }
  revalidatePath("/", "layout");

  return notifi;
};
export const toggleBookmark = async (postId: string) => {
  const auth = await checkAuthServer();
  const checked = await prisma.bookmark.findUnique({
    where: {
      authorId_postId: { authorId: auth.id, postId: postId },
    },
  });

  if (checked) {
    await prisma.bookmark.delete({
      where: {
        authorId_postId: { authorId: auth.id, postId: postId },
      },
    });
  } else {
    await prisma.bookmark.create({
      data: { authorId: auth.id, postId: postId },
    });
  }
  revalidatePath("/", "layout");
};

// notification
const createNotification = async ({
  issuerId,
  recipientId,
  type,
  postId,
  userId,
}: {
  issuerId: string;
  recipientId: string;
  type: NotificationType;
  postId?: string;
  userId?: string;
}): Promise<NotificationDataType> => {
  const notifi = await prisma.notification.create({
    data: {
      issuerId,
      recipientId,
      type,
      postId,
      userId,
    },
    include: {
      issuer: true,
    },
  });

  return notifi;
};
export const getNotifications = async ({}) => {
  const auth = await checkAuthServer();
  return await prisma.notification.findMany({
    where: {
      recipientId: auth.id,
    },
    include: {
      issuer: true,
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const markAllNotificationsAsRead = async () => {
  const auth = await checkAuthServer();

  await prisma.notification.updateMany({
    where: {
      recipientId: auth.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/", "layout");
};
