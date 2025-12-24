"use server";
import { AuthType } from "@/src/stores/auth.store";
import prisma from "./prisma";

export const updateAuth = async (clerkId: string, data: Partial<AuthType>) => {
  return await prisma.user.update({
    where: {
      clerkId: clerkId,
    },
    data: {
      name: data.name,
      username: data.username,
      avatarUrl: data.avatarUrl,
      backgroundUrl: data.backgroundUrl,
      bio: data.bio,
      websiteUrl: data.websiteUrl,
    },
  });
};
