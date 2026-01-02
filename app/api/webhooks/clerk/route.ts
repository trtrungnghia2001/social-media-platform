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

  // 1. Lấy headers xác thực
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // 2. Lấy body dữ liệu
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // 3. Xác thực gói tin
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

  const eventType = evt.type;

  // 4. Xử lý logic đồng bộ
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, image_url, username, email_addresses } =
      evt.data;

    // Fix: Gom tên gọn gàng, ưu tiên đầy đủ, không có thì để User
    const displayName =
      [first_name, last_name].filter(Boolean).join(" ") || "User";

    // Fix username: Loại bỏ mọi ký tự @ nếu lỡ có, và tạo fallback an toàn
    const primaryEmail = email_addresses?.[0]?.email_address;
    let finalUsername = username || primaryEmail?.split("@")[0] || id.slice(-8);

    // Đảm bảo không có dấu @ trong username lưu vào DB
    finalUsername = finalUsername.replace("@", "");

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          name: displayName,
          username: finalUsername,
          avatarUrl: image_url,
        },
        create: {
          clerkId: id,
          name: displayName,
          username: finalUsername,
          avatarUrl: image_url,
        },
      });
      console.log(`User ${id} ${eventType} successfully`);
    } catch (error) {
      console.error("Prisma Webhook Error:", error);
      return new Response("Database Error", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({
        where: { clerkId: evt.data.id },
      });
    } catch (error) {
      console.error("Prisma Delete Error:", error);
    }
  }

  return new Response("Webhook processed", { status: 200 });
}
