"use client";

import { useSocketContext } from "@/contexts/SocketContext";
import clsx from "clsx";
import { ComponentProps, memo } from "react";

interface OnlineStatus extends ComponentProps<"div"> {
  userId: string;
}

const OnlineStatus = ({ userId, className, ...props }: OnlineStatus) => {
  const { onlineUsers } = useSocketContext();

  const status = onlineUsers.includes(userId);

  if (!status) return null;

  return (
    <div
      className={clsx([
        `absolute bottom-0 right-0 inline-block w-3 aspect-square bg-green-500 rounded-full border-2 border-background`,
        className,
      ])}
      {...props}
    />
  );
};

export default memo(OnlineStatus);
