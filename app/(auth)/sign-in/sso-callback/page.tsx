"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  // Component này của Clerk sẽ xử lý việc trao đổi Token ngầm
  // Sau khi xong, nó sẽ tự động redirect về trang chủ dựa trên .env
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang xác thực, đợi chút nhé bro...</p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
