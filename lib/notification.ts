"use server";
import prisma from "./prisma";

export const getNotifications = async ({
  currentUserId,
  page = 1,
  limit = 10,
}: {
  currentUserId: string;
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const [notifications, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where: { recipientId: currentUserId },
      take: limit,
      skip: skip,
      include: {
        issuer: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        post: {
          select: { id: true, content: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({
      where: { recipientId: currentUserId },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    notifications,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
export const readNotification = async (notiId: string) => {
  return await prisma.notification.update({
    where: { id: notiId },
    data: {
      isRead: true,
    },
  });
};
