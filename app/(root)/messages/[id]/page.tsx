"use client";
import MessageForm from "@/components/form/MessageForm";
import MessageCard from "@/components/MessageCard";
import OnlineStatus from "@/components/OnlineStatus";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const MessagesIdPage = () => {
  const { onlineUsers } = useSocketContext();
  const params = useParams();
  const userId = params.id as string;

  return (
    <div className="h-full flex flex-col justify-between">
      {/* header */}
      <section className="p-4 flex items-center justify-between gap-8 border-b border-b-border shadow">
        <Link href={`/user/` + `user_1`} className="flex items-center gap-2">
          <div className="relative">
            <Image
              alt="avatar"
              src={IMAGE_DEFAULT.AVATAR}
              loading="lazy"
              width={40}
              height={40}
              unoptimized
              className="rounded-full"
            />
            <OnlineStatus status={onlineUsers.includes(userId)} />
          </div>
          <div>
            <h3>Mai Phuong Thuy</h3>
          </div>
        </Link>
        <div>
          <button className="btn-options">
            <Video size={18} />
          </button>
        </div>
      </section>
      {/* main */}
      <section className="flex-1 overflow-y-auto scrollbar-beauty p-4">
        <ul className="space-y-4">
          {Array(50)
            .fill(0)
            .map((_, idx) => {
              return (
                <li key={idx}>
                  <MessageCard />
                </li>
              );
            })}
        </ul>
      </section>
      {/* input */}
      <MessageForm />
    </div>
  );
};

export default MessagesIdPage;
