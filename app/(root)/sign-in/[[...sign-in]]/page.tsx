"use client";
import SocialLogin from "@/components/form/SocialLogin";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";
import { RiLoader2Fill } from "react-icons/ri";

export default function SignInPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="w-full max-w-md space-y-6 rounded-2xl border border-border p-8 shadow-xl"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight ">
              Đăng nhập
            </h1>
            <p className="text-sm">Chào mừng bạn quay trở lại</p>
          </div>

          <SocialLogin />

          {/* FORM NHẬP EMAIL/PASSWORD */}
          <div className="space-y-4">
            <Clerk.Field name="identifier">
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
            <SignIn.Action submit className="btn w-full rounded-lg">
              <Clerk.Loading>
                {(isGlobalLoading) =>
                  isGlobalLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RiLoader2Fill className="animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )
                }
              </Clerk.Loading>
            </SignIn.Action>
          </div>

          <p className="text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Đăng ký
            </Link>
          </p>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
