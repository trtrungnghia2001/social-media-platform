"use client";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect } from "react";
import OnlineStatus from "../OnlineStatus";
import { UserDataType } from "@/types";
import { Video } from "lucide-react";
import { useSocketContext } from "@/contexts/SocketContext";
import { readMessages } from "@/lib/actions";
import { useAuthContext } from "@/contexts/AuthContext";

const MessageHeader = ({ user }: { user: UserDataType }) => {
  const { auth } = useAuthContext();
  const { setCurrentUser } = useSocketContext();

  useEffect(() => {
    if (!user || !auth) return;

    setCurrentUser(user);

    void readMessages(user.id);
  }, [user.id, auth?.id]);

  return (
    <section className="p-4 flex items-center justify-between gap-8 border-b border-b-border shadow">
      <Link href={`/user/` + user.username} className="flex items-center gap-2">
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
        <div>
          <h3>{user.name}</h3>
          <p className="text-13 text-secondary">@{user.username}</p>
        </div>
      </Link>
      <div>
        <button className="btn-options">
          <Video size={18} />
        </button>
      </div>
    </section>
  );
};

export default memo(MessageHeader);
