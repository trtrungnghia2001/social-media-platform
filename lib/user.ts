"use server";
import prisma from "./prisma";

export const getUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  const postTotals = await prisma.post.count({
    where: {
      author: {
        username: username,
      },
    },
  });

  return {
    user,
    postTotals,
  };
};
export const getUnreadCounts = async (userId: string) => {
  const [unreadNotifications] = await Promise.all([
    // Đếm thông báo chưa đọc
    prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    }),
    // Đếm tin nhắn chưa đọc (Giả sử bạn có model Message)
    // prisma.message.count({
    //   where: {
    //     receiverId: userId,
    //     isRead: false,
    //   },
    // }),
  ]);

  return {
    unreadNotifications,
    // unreadMessages,
  };
};
