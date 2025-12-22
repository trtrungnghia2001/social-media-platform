"use client";
import { FaApple, FaGoogle } from "react-icons/fa";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="h-screen max-w-xl w-full mx-auto gap-12 flex flex-col items-center justify-center">
      <div className="space-y-2 max-w-xs text-center">
        <h2 className="text-3xl font-bold text-center">
          Social Media Platform
        </h2>
        <h4 className="text-xl font-bold">Happening now. Join today.</h4>
        <div className="space-y-2">
          <SignIn.Root>
            <Clerk.Connection
              name="google"
              className="btn bg-white text-black flex items-center justify-center gap-2 border border-border hover:bg-secondary-bg w-full"
            >
              <FaGoogle size={14} /> Sign in with Google
            </Clerk.Connection>
            <Clerk.Connection
              name="apple"
              className="btn bg-white text-black flex items-center justify-center gap-2 border border-border hover:bg-secondary-bg w-full"
            >
              <FaApple size={16} /> Sign in with Apple
            </Clerk.Connection>

            {/* <SignIn.Step name="start" className="space-y-2">
              <Clerk.Field name="identifier" className="flex flex-col gap-2">
                <Clerk.Input
                  placeholder="email@gmail.com"
                  className="border border-border outline-none rounded-full px-4 py-2"
                />
                <Clerk.FieldError className="text-red-500 text-13" />
              </Clerk.Field>

              <SignIn.Action
                submit
                className="underline text-center text-blue-500 w-full"
              >
                Continue
              </SignIn.Action>
            </SignIn.Step>
            <SignIn.Step name="verifications">
              <SignIn.Strategy name="password">
                <Clerk.Field name="password" className="flex flex-col gap-2">
                  <Clerk.Input
                    placeholder="******"
                    className="border border-border outline-none rounded-full px-4 py-2"
                  />
                  <Clerk.FieldError className="text-red-500 text-13" />
                </Clerk.Field>

                <SignIn.Action
                  submit
                  className="underline text-center text-blue-500 w-full"
                >
                  Continue
                </SignIn.Action>
              </SignIn.Strategy>
            </SignIn.Step> */}
          </SignIn.Root>
        </div>
        <Link href={`/`} className="text-blue-500">
          Go to home
        </Link>
      </div>
    </div>
  );
}
