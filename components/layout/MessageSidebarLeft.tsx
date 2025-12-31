"use client";
import { memo } from "react";
import InputSearch from "../form/InputSearch";
import OnlineStatus from "../OnlineStatus";
import clsx from "clsx";
import Image from "next/image";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import Link from "next/link";
import { getUsers } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

const MessageSidebarLeft = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getUsers(),
  });
  return (
    <aside className="h-full py-4 px-2 w-3xs flex flex-col gap-4 border-r border-r-border">
      <div className="px-2">
        <InputSearch />
      </div>
      <ul className="overflow-y-auto scrollbar-beauty">
        {users?.map((user) => (
          <li key={user.id}>
            <Link
              href={`/messages/` + user.username}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondaryBg"
            >
              <div className="relative">
                <Image
                  alt="avatar"
                  src={user.avatarUrl || IMAGE_DEFAULT.AVATAR}
                  loading="lazy"
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full"
                />
                <OnlineStatus userId={user.id} />
              </div>
              <div>
                <h3>{user.name}</h3>
                <p className={clsx(`text-13 text-secondary`)}>Me: Ok bro!</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default memo(MessageSidebarLeft);
