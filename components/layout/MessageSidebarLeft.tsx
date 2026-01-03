"use client";
import { ComponentProps, memo, useEffect, useMemo, useState } from "react";
import InputSearch from "../form/InputSearch";
import OnlineStatus from "../OnlineStatus";
import clsx from "clsx";
import Image from "next/image";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import Link from "next/link";
import { getUsers } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Check, CheckCheck } from "lucide-react";
import { UserDataType } from "@/types";
import { useDebounce } from "use-debounce";
import { useSocketContext } from "@/contexts/SocketContext";

const MessageSidebarLeft = ({
  className,
  ...props
}: ComponentProps<"aside">) => {
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 1000);
  const { setSearchUser } = useSocketContext();
  useEffect(() => {
    setSearchUser(value);
  }, [value, setSearchUser]);

  const { data: users } = useQuery({
    queryKey: ["users", value],
    queryFn: async () => await getUsers(value),
  });

  return (
    <aside
      className={clsx([
        `h-full py-4 px-2 w-full xl:w-3xs flex flex-col gap-4 xl:border-r xl:border-r-border`,
        className,
      ])}
      {...props}
    >
      <div className="px-2">
        <InputSearch value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <ul className="flex-1 overflow-y-auto scrollbar-beauty">
        {users?.map((user) => (
          <ContactUser key={user.id} user={user} />
        ))}
      </ul>
    </aside>
  );
};

export default memo(MessageSidebarLeft);

export const ContactUser = ({ user }: { user: UserDataType }) => {
  const { auth } = useAuthContext();
  const { username } = useParams();

  const lastMsg = user.lastMessage;
  const isMe = lastMsg?.senderId === auth?.id;

  const isPartnerRead = lastMsg?.readBy.includes(user.id);

  const amIRead = isMe ? true : lastMsg?.readBy.includes(auth?.id as string);

  const text = useMemo(() => {
    if (!user.lastMessage) return ``;

    const name =
      user.lastMessage.senderId === auth?.id
        ? `Me`
        : user.lastMessage.sender.name.split(" ").pop();

    const mess = user.lastMessage.mediaUrl
      ? `sent photo`
      : user.lastMessage.text;

    return name + `: ` + mess;
  }, [auth?.id, user.lastMessage]);

  return (
    <li key={user.id}>
      <Link
        href={`/messages/` + user.username}
        className={clsx([
          `flex items-center gap-2 p-2 rounded-lg hover:bg-secondaryBg`,
          user.username === username && `bg-secondaryBg`,
        ])}
      >
        <div className="relative">
          <Image
            alt="avatar"
            src={user.avatarUrl || IMAGE_DEFAULT.AVATAR}
            loading="lazy"
            width={40}
            height={40}
            unoptimized
            className="rounded-full aspect-square img"
          />
          <OnlineStatus userId={user.id} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="truncate font-medium">{user.name}</h3>
          <div className="flex items-center justify-between gap-1">
            <p
              className={clsx(
                `text-13 line-clamp-1 flex-1`,
                amIRead
                  ? "text-secondary font-normal"
                  : "text-foreground font-bold"
              )}
            >
              {text}
            </p>
            {isMe && lastMsg && (
              <div className="ml-auto">
                {isPartnerRead ? (
                  <CheckCheck size={14} className="text-blue-500" />
                ) : (
                  <Check size={14} className="text-secondary" />
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
