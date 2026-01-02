"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { MessageDataType } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

const MessageCard = ({ message }: { message: MessageDataType }) => {
  const { auth } = useAuthContext();
  const owner = useMemo(() => {
    return auth?.id === message.senderId;
  }, [auth, message]);

  return (
    <div
      className={clsx(
        `flex flex-col gap-2`,
        owner ? `items-end` : `items-start`
      )}
    >
      {message.text && (
        <div
          className={clsx(
            `max-w-[45%] whitespace-break-spaces rounded-full shadow px-4 py-2`,
            owner ? `bg-slate-900 text-white` : `bg-slate-200 text-slate-900`
          )}
          dangerouslySetInnerHTML={{
            __html: message.text,
          }}
        ></div>
      )}
      {message.mediaUrl && (
        <Image
          alt="mediaUrl"
          src={message.mediaUrl}
          loading="lazy"
          width={256}
          height={256}
          unoptimized
          className="max-w-[45%] rounded-lg"
        />
      )}
      <p className="text-13 text-secondary">
        {new Date(message.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default MessageCard;
