"use server";
import {
  Comment,
  Message,
  NotificationType,
  Post,
  Prisma,
  User,
} from "@/app/generated/prisma/client";
import prisma from "./prisma";
import { auth, type User as ClerkUser } from "@clerk/nextjs/server";
import {
  CommentDataType,
  MessageDataType,
  NotificationDataType,
  PostDataType,
  UserDataType,
} from "@/types";
import { revalidatePath } from "next/cache";

const pageSize = 10;

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
export async function syncAndGetAuth(clerkUser: ClerkUser | null) {
  const { userId } = await auth();
  if (!userId) return null;

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Nếu chưa có (Webhook chậm/lỗi), tự tạo luôn từ data Clerk gửi xuống
  if (!dbUser && clerkUser) {
    const displayName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      "User";
    const username =
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ||
      userId.slice(-8);

    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: displayName,
        username: username.replace("@", ""),
        avatarUrl: clerkUser.imageUrl,
      },
    });
    console.log("✅ Auto-sync: Created missing user in DB");
  }

  return dbUser;
}
export const getAuth = async () => {
  const auth = await checkAuthServer();

  return auth;
};

export const getAuthUnreadCounts = async () => {
  const auth = await checkAuthServer();
  const [unreadNotifications, unreadMessages] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: auth.id,
        read: false,
      },
    }),
    prisma.message.count({
      where: {
        receiverId: auth.id,
        NOT: {
          readBy: { has: auth.id },
        },
      },
    }),
  ]);

  return {
    unreadNotifications,
    unreadMessages,
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
      receivedMessages: {
        where: {
          senderId: authId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      sentMessages: {
        where: {
          receiverId: authId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!getUser) return null;

  const lastSent = getUser.sentMessages[0];
  const lastReceived = getUser.receivedMessages[0];

  let lastMessage = null;
  if (lastSent && lastReceived) {
    lastMessage =
      lastSent.createdAt > lastReceived.createdAt ? lastSent : lastReceived;
  } else {
    lastMessage = lastSent || lastReceived || null;
  }

  const formattedUser: UserDataType = {
    ...getUser,
    isFollowing: !!getUser && getUser.followers.length > 0,
    lastMessage,
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
      receivedMessages: {
        where: {
          senderId: authId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      sentMessages: {
        where: {
          receiverId: authId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const formattedUsers: UserDataType[] = users.map((u) => {
    const lastSent = u.sentMessages[0];
    const lastReceived = u.receivedMessages[0];

    let lastMessage = null;
    if (lastSent && lastReceived) {
      lastMessage =
        lastSent.createdAt > lastReceived.createdAt ? lastSent : lastReceived;
    } else {
      lastMessage = lastSent || lastReceived || null;
    }

    return {
      ...u,
      isFollowing: !!user && u.followers.length > 0,
      lastMessage: lastMessage,
      followers: undefined,
      receivedMessages: undefined,
      sentMessages: undefined,
    };
  });

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

  if (following && !authId) {
    return { posts: [], nextCursor: null };
  }

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
// chat
export const createMessage = async (
  data: Partial<Message>
): Promise<MessageDataType> => {
  const auth = await checkAuthServer();

  const newMess = await prisma.message.create({
    data: {
      ...data,
      senderId: auth.id,
      receiverId: data.receiverId as string,
      readBy: [auth.id],
    },
    include: {
      receiver: true,
      sender: true,
    },
  });
  return newMess;
};
export const getMessagesInfinite = async ({
  partnerId,
  cursor,
}: {
  partnerId: string;
  cursor?: string;
}): Promise<{
  messages: MessageDataType[];
  nextCursor: string | undefined;
}> => {
  const user = await checkAuthServer();

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: user.id },
      ],
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: true,
    },
  });

  let nextCursor: string | undefined = undefined;
  if (messages.length > pageSize) {
    const nextItem = messages.pop();
    nextCursor = nextItem?.id;
  }

  return {
    messages: messages.reverse(),
    nextCursor,
  };
};
export const readMessages = async (userId: string) => {
  const auth = await checkAuthServer();

  return await prisma.message.updateMany({
    where: {
      senderId: userId,
      receiverId: auth.id,
      NOT: {
        readBy: { has: auth.id },
      },
    },
    data: {
      readBy: {
        set: [auth.id, userId],
      },
    },
  });
};
