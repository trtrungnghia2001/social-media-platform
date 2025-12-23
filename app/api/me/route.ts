import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      console.error("🔴 [ME_GET]: Clerk session không tồn tại");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkId: string = user.id;
    const name: string =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      "New User";
    const username: string = user.username || `user_${clerkId.substring(0, 8)}`;
    const avatarUrl: string = user.imageUrl || "";

    // dbUser sẽ tự động có kiểu là User (được import từ @prisma/client)
    const dbUser: User = await prisma.user.upsert({
      where: { clerkId },
      update: {
        avatarUrl,
      },
      create: {
        clerkId,
        name,
        username,
        avatarUrl,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    console.error("🔴 [ME_GET_ERROR] Chi tiết:", errorMessage);

    return new NextResponse(`Internal Error: ${errorMessage}`, {
      status: 500,
    });
  }
}
