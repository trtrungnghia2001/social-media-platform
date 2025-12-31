"use client";

import SocialLogin from "@/components/form/SocialLogin";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import { RiLoader2Fill } from "react-icons/ri";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <SignUp.Root>
        {/* BƯỚC 1: ĐIỀN THÔNG TIN ĐĂNG KÝ */}
        <SignUp.Step
          name="start"
          className="w-full max-w-md space-y-6 rounded-2xl border border-border p-8 shadow-xl"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Tạo tài khoản
            </h1>
            <p className="text-sm">Tham gia cùng chúng tôi ngay hôm nay</p>
          </div>

          <SocialLogin />

          <div className="space-y-4">
            <Clerk.Field name="emailAddress">
              <Clerk.Label className="text-sm font-medium">Email</Clerk.Label>
              <Clerk.Input className="input" />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="password">
              <Clerk.Label className="text-sm font-medium">
                Mật khẩu
              </Clerk.Label>
              <Clerk.Input className="input" />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <SignUp.Action submit className="btn w-full rounded-lg">
              <Clerk.Loading>
                {(isGlobalLoading) =>
                  isGlobalLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RiLoader2Fill className="animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Tiếp tục"
                  )
                }
              </Clerk.Loading>
            </SignUp.Action>
          </div>

          <p className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </SignUp.Step>

        {/* BƯỚC 2: XÁC THỰC MÃ OTP (Bắt buộc phải có) */}
        <SignUp.Step
          name="verifications"
          className="w-full max-w-md space-y-6 rounded-2xl border border-border p-8 shadow-xl"
        >
          <SignUp.Strategy name="email_code">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Xác thực Email
              </h1>
              <p className="text-sm">
                Nhập mã 6 số đã được gửi đến email của bạn
              </p>
            </div>

            <div className="space-y-4">
              <Clerk.Field name="code">
                <Clerk.Label className="text-sm font-medium">
                  Mã xác thực
                </Clerk.Label>
                <Clerk.Input className="input" />
                <Clerk.FieldError className="text-xs text-red-500" />
              </Clerk.Field>

              <SignUp.Action submit className="btn w-full rounded-lg">
                <Clerk.Loading>
                  {(isGlobalLoading) =>
                    isGlobalLoading ? (
                      <RiLoader2Fill className="mx-auto animate-spin" />
                    ) : (
                      "Xác minh tài khoản"
                    )
                  }
                </Clerk.Loading>
              </SignUp.Action>
            </div>
          </SignUp.Strategy>
        </SignUp.Step>

        {/* --- BƯỚC 3: ĐIỀN TIẾP INFO --- */}
        <SignUp.Step
          name="continue"
          className="w-full max-w-md space-y-6 rounded-2xl border border-border p-8 shadow-xl"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Thiết lập hồ sơ
            </h1>
            <p className="text-sm">Chỉ một bước nữa để bắt đầu khám phá</p>
          </div>

          <div className="space-y-4">
            <Clerk.Field name="username">
              <Clerk.Label className="text-sm font-medium">
                Username
              </Clerk.Label>
              <Clerk.Input placeholder="ví dụ: nambro_99" className="input" />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="firstName">
              <Clerk.Label className="text-sm font-medium">
                First name
              </Clerk.Label>
              <Clerk.Input placeholder="First name" className="input" />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <Clerk.Field name="lastName">
              <Clerk.Label className="text-sm font-medium">
                Last name
              </Clerk.Label>
              <Clerk.Input placeholder="Last name" className="input" />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <SignUp.Action submit className="btn w-full rounded-lg">
              <Clerk.Loading>
                {(isGlobalLoading) =>
                  isGlobalLoading ? (
                    <RiLoader2Fill className="mx-auto animate-spin" />
                  ) : (
                    "Hoàn tất đăng ký"
                  )
                }
              </Clerk.Loading>
            </SignUp.Action>
          </div>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}
