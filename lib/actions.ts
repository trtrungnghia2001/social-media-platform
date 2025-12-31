"use server";
import {
  Comment,
  NotificationType,
  Post,
  Prisma,
  User,
} from "@/app/generated/prisma/client";
import prisma from "./prisma";
import { auth } from "@clerk/nextjs/server";
import {
  CommentDataType,
  NotificationDataType,
  PostDataType,
  UserDataType,
} from "@/types";
import { revalidatePath } from "next/cache";

const pageSize = 5;

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
export const getUserByUsername = async (
  username: string
): Promise<UserDataType | null> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const getUser = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      followers: {
        where: {
          followerId: authId,
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true,
        },
      },
    },
  });

  if (!getUser) return null;

  const formattedUser: UserDataType = {
    ...getUser,
    isFollowing: !!getUser && getUser.followers.length > 0,
  };

  return formattedUser;
};
export const getUsers = async (q = ""): Promise<UserDataType[]> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
      ],
      NOT: {
        id: authId,
      },
    },
    include: {
      followers: {
        where: {
          followerId: authId,
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true,
        },
      },
    },

    take: 10,
  });

  const formattedUsers: UserDataType[] = users.map((u) => ({
    ...u,
    isFollowing: !!user && u.followers.length > 0,
  }));

  return formattedUsers;
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
export const getPostInfinite = async ({
  cursor,
  username,
  following,
  q = "",
}: {
  cursor?: string;
  username?: string;
  following?: boolean;
  q?: string;
}): Promise<{ posts: PostDataType[]; nextCursor: string | null }> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const where: Prisma.PostWhereInput = {
    ...(username
      ? { author: { username } }
      : following && authId
      ? {
          author: {
            followers: {
              some: {
                followerId: authId,
              },
            },
          },
        }
      : {}),
    text: {
      contains: q,
      mode: "insensitive",
    },
  };

  const posts = await prisma.post.findMany({
    take: pageSize,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: where,
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
          comments: true,
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

  const nextCursor = posts.length === pageSize ? posts[pageSize - 1].id : null;

  const formattedPosts = posts.map((post) => ({
    ...post,
    isLiked: !!authId && post.likes?.length > 0,
    isBookmarked: !!authId && post.bookmarks?.length > 0,
    isShared: false, // Để tạm false vì bro chưa làm share
    _count: {
      ...post._count,
      shares: 0,
    },
    likes: undefined,
    bookmarks: undefined,
  }));
  return { posts: formattedPosts, nextCursor };
};
export const getPostById = async (id: string): Promise<PostDataType | null> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const post = await prisma.post.findFirst({
    where: {
      id,
    },
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
          comments: true,
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

  if (!post) return null;

  return {
    ...post,
    isLiked: !!authId && post.likes?.length > 0,
    isBookmarked: !!authId && post.bookmarks?.length > 0,
    isShared: false,
    _count: {
      ...post._count,
      shares: 0,
    },
  };
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
export const deletePostId = async (id: string) => {
  await checkAuthServer();
  const post = await prisma.post.delete({ where: { id } });

  return post;
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
        postId: postId,
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
// comment and reply
export const getCommentById = async (
  commentId: string
): Promise<CommentDataType | null> => {
  return await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
    include: {
      author: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });
};
export const createComment = async (data: Partial<Comment>) => {
  const auth = await checkAuthServer();

  const newComment = await prisma.comment.create({
    data: {
      ...data,
      authorId: auth.id,
      postId: data.postId as string,
      parentCommentId: data.parentCommentId,
    },
    include: {
      post: true,
    },
  });

  const comment = await getCommentById(newComment.id);

  let notifi;
  if (newComment.post.authorId !== auth.id) {
    notifi = await createNotification({
      issuerId: auth.id,
      recipientId: newComment.post.authorId,
      type: "COMMENT",
      postId: newComment.postId,
    });
  }

  return { comment, notifi };
};
export const deleteCommentById = async (commentId: string) => {
  return await prisma.comment.delete({ where: { id: commentId } });
};
export const getCommentsByPostId = async (
  postId: string
): Promise<CommentDataType[]> => {
  const user = await getOptionalAuth();
  const authId = user?.id;

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
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
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map((post) => ({
    ...post,
    // isLiked: !!authId && post.likes?.length > 0,
    // _count: {
    //   ...post._count,
    //   comments: 10,
    //   shares: 40,
    // },

    // likes: undefined,
    // bookmarks: undefined,
  }));
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
export const getNotifications = async ({}): Promise<NotificationDataType[]> => {
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
