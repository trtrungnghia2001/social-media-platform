"use client";
import React, { memo, useMemo } from "react";
import { MessageType } from "../stores/message.store";
import { useAuthStore } from "../stores/auth.store";
import clsx from "clsx";
import Image from "next/image";
const MessageCard = ({ message }: { message: MessageType }) => {
  const { auth } = useAuthStore();

  const owner = useMemo(() => {
    if (auth?._id === message.senderId) return true;
    return false;
  }, [message.senderId, auth]);

  return (
    <div
      className={clsx([
        `flex flex-col gap-2`,
        owner ? `items-end` : `items-start`,
      ])}
    >
      {message.content && (
        <div
          className={clsx([
            `p-2 rounded-lg shadow max-w-[45%]`,
            owner
              ? "bg-slate-800 text-white rounded-br-none"
              : "bg-slate-100 text-slate-900 rounded-bl-none",
          ])}
        >
          {message.content}
        </div>
      )}
      {message.mediaUrl && (
        <Image
          alt="media"
          src={message.mediaUrl}
          width={160}
          height={0}
          className="h-auto rounded-lg"
        />
      )}
      <div className="text-xs text-secondary">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default memo(MessageCard);
