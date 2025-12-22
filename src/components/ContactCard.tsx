"use client";
import { memo } from "react";
import { ContactType } from "../stores/message.store";
import Image from "next/image";
import { IMAGES_DEFAULT } from "../constants/img";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useSocket } from "../contexts/useSocket";
import OnlineStatus from "./OnlineStatus";

const ContactCard = ({ contact }: { contact: ContactType }) => {
  const pathname = usePathname();
  const { onlineUsers } = useSocket();

  return (
    <Link
      href={`/messages/` + contact.id}
      className={clsx([
        `flex items-center gap-4 p-2 hover:bg-secondary-bg rounded-lg`,
        pathname.split("/")[2] === contact.id && `bg-secondary-bg`,
      ])}
    >
      <div className="relative">
        <Image
          alt="avatar"
          loading="lazy"
          src={contact.avatarUrl || IMAGES_DEFAULT.AVATAR}
          width={32}
          height={32}
          className="rounded-full"
        />
        <OnlineStatus status={onlineUsers.includes(contact.id)} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold">{contact.name}</h3>
        <p className="text-xs text-secondary line-clamp-1">
          {contact.lastMessage?.content}
        </p>
      </div>
    </Link>
  );
};

export default memo(ContactCard);
