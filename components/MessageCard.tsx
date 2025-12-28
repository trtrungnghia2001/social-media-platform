"use client";

import clsx from "clsx";
import Image from "next/image";
import { useMemo } from "react";

const MessageCard = () => {
  const owner = useMemo(() => {
    const randomInt = Math.random();
    return Math.floor(randomInt * 10) % 4 === 0;
  }, []);
  return (
    <div
      className={clsx(
        `flex flex-col gap-2`,
        owner ? `items-end` : `items-start`
      )}
    >
      {true && (
        <div
          className={clsx(
            `max-w-[45%] whitespace-break-spaces rounded-full shadow px-4 py-2`,
            owner ? `bg-slate-900 text-white` : `bg-slate-200 text-slate-900`
          )}
          dangerouslySetInnerHTML={{
            __html: `Hello, I&apos;m Nghia. I have sex :))`,
          }}
        ></div>
      )}
      {true && (
        <Image
          alt="avatar"
          src={
            "https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg"
          }
          loading="lazy"
          width={256}
          height={256}
          unoptimized
          className="max-w-[45%] rounded-lg"
        />
      )}
      <p className="text-13 text-secondary">{new Date().toLocaleString()}</p>
    </div>
  );
};

export default MessageCard;
