"use client";
import * as Clerk from "@clerk/elements/common";
import { FaApple, FaGoogle } from "react-icons/fa";

const SocialLogin = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Clerk.Connection
          name="google"
          className="btn flex w-full items-center justify-center gap-2 rounded-md"
        >
          <FaGoogle />
          Google
        </Clerk.Connection>

        <Clerk.Connection
          name="apple"
          className="btn flex w-full items-center justify-center gap-2 rounded-md"
        >
          <FaApple />
          Apple
        </Clerk.Connection>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>
    </>
  );
};

export default SocialLogin;
