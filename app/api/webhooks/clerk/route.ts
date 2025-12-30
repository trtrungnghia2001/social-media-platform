import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // Lấy các headers xác thực từ Clerk gửi sang
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Lấy body dữ liệu
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Xác thực gói tin
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  // Xử lý logic đồng bộ vào Prisma
  const eventType = evt.type;
  console.log({ eventType });

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, image_url, username } = evt.data;

    // Lưu hoặc cập nhật User vào DB của bạn
    const name = `${first_name} ${last_name}` as string;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        name: name,
        username: username as string,
        avatarUrl: image_url,
      },
      create: {
        clerkId: id,
        name: name,
        username: username as string,
        avatarUrl: image_url,
      },
    });
  }
  if (eventType === "user.deleted") {
    await prisma.user.delete({
      where: { clerkId: evt.data.id },
    });
  }

  return new Response("", { status: 200 });
}
