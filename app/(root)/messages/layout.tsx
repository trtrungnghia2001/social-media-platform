"use client";
import InputSearch from "@/components/form/InputSearch";
import OnlineStatus from "@/components/OnlineStatus";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { mockUsers } from "@/helpers/mockdata";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { onlineUsers } = useSocketContext();
  return (
    <div className="h-screen flex items-stretch">
      <aside className="h-full py-4 px-2 w-3xs flex flex-col gap-4 border-r border-r-border">
        <div className="px-2">
          <InputSearch />
        </div>
        <ul className="overflow-y-auto scrollbar-beauty">
          {mockUsers.map((user) => (
            <li key={user.id}>
              <Link
                href={`/messages/` + user.id}
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
      <section className="h-full flex-1">{children}</section>
    </div>
  );
};

export default Layout;
