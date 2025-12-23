import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // 1. Lấy Signing Secret từ Env
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // 2. Lấy các headers từ request để xác thực (verify)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Nếu thiếu header, trả về lỗi ngay
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // 3. Lấy body của request
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Khởi tạo Svix để verify
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
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, image_url, first_name, last_name, username, email_addresses } =
      evt.data;
    console.log({
      id,
      image_url,
      first_name,
      last_name,
      username,
      email_addresses,
    });

    const firstName = first_name || "";
    const lastName = last_name || "";
    const fullName =
      (firstName + " " + lastName).trim() ||
      username ||
      email_addresses?.[0]?.email_address?.split("@")[0] ||
      `User_${id.substring(0, 5)}`;

    const finalUsername = username || `user_${id.substring(0, 8)}`;

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          name: fullName,
          avatarUrl: image_url || "", // Đảm bảo không null
          username: finalUsername,
        },
      });
      console.log(`✅ Webhook: User ${id} đã được lưu vào DB thành công`);
    } catch (dbError) {
      console.error("❌ Lỗi khi lưu User vào DB từ Webhook:", dbError);
      // Bạn nên trả về 500 ở đây để Clerk biết và gửi lại Webhook sau (Retry)
      return new Response("Error saving user to database", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
