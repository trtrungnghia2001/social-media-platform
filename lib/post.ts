"use server";
import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import { InteractionType, NotificationType } from "@/app/generated/prisma";

export const getPostsInfinity = async ({
  currentUserId,
  cursor,
  limit = 10,
  where,
}: {
  currentUserId?: string;
  cursor?: string;
  limit?: number;
  where?: Prisma.PostWhereInput;
}) => {
  const posts = await prisma.post.findMany({
    where,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    include: {
      author: {
        select: { id: true, name: true, username: true, avatarUrl: true },
      },
      // Lấy tất cả interactions để phân loại và đếm ở bước map
      interactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let nextCursor: string | undefined = undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem?.id;
  }

  const formattedPosts = posts.map((post) => {
    const allInteractions = post.interactions || [];

    // Lọc ra các interactions của user hiện tại để xác định trạng thái nút bấm
    const currentUserInteractions = allInteractions.filter(
      (i) => i.userId === currentUserId
    );

    return {
      ...post,
      // Trạng thái nút (Active/Inactive)
      isFavorite: currentUserInteractions.some((i) => i.type === "FAVORITE"),
      isBookmark: currentUserInteractions.some((i) => i.type === "BOOKMARK"),
      isShare: currentUserInteractions.some((i) => i.type === "SHARE"),

      // TỔNG SỐ LƯỢNG (Totals)
      totalFavorites: allInteractions.filter((i) => i.type === "FAVORITE")
        .length,
      totalShares: allInteractions.filter((i) => i.type === "SHARE").length,
      totalBookmarks: allInteractions.filter((i) => i.type === "BOOKMARK")
        .length,
      totalComments: 0,

      createdAt: post.createdAt.toISOString(),
      interactions: undefined, // Xóa mảng thô để giảm dung lượng tải về trình duyệt
    };
  });

  return { posts: formattedPosts, nextCursor };
};
export const createPost = async (data: {
  authorId: string;
  content?: string;
  mediaUrl?: string;
}) => {
  return await prisma.post.create({ data: data });
};
export const deletePost = async (postId: string) => {
  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
export const activePost = async ({
  postId,
  userId,
  type,
}: {
  postId: string;
  userId: string;
  type: InteractionType;
}) => {
  const existing = await prisma.interaction.findUnique({
    where: {
      userId_postId_type: { type, postId, userId },
    },
  });

  if (existing) {
    await prisma.interaction.delete({
      where: { id: existing.id },
    });
    return { action: "removed", type };
  } else {
    const newInteraction = await prisma.interaction.create({
      data: { userId, postId, type },
      include: { post: true },
    });

    // Tạo thông báo
    if (newInteraction.post.authorId === userId) {
      await prisma.notification.create({
        data: {
          recipientId: newInteraction.post.authorId,
          issuerId: userId,
          postId: postId,
          type: type as NotificationType,
        },
      });
    }

    return { action: "added", type };
  }
};
