import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

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

  // 5. Xử lý logic dựa trên loại sự kiện (Event Type)
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    // LOGIC CỦA BẠN: Lưu vào database ở đây
    // Ví dụ dùng Prisma:
    /*
    await db.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        avatarUrl: image_url,
        username: username || `user_${id.substring(0, 8)}`,
      }
    })
    */

    console.log(`Webhook: User ${id} đã được lưu vào DB`);
  }

  return new Response("", { status: 200 });
}
