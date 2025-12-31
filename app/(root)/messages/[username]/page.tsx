"use client";
import MessageForm from "@/components/form/MessageForm";
import MessageCard from "@/components/MessageCard";
import OnlineStatus from "@/components/OnlineStatus";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { getUserByUsername } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const MessagesUsernamePage = () => {
  const params = useParams();
  const username = params.username as string;
  const { setCurrentUser } = useSocketContext();

  const { data: user } = useQuery({
    queryKey: ["message", "users", username],
    queryFn: async () => getUserByUsername(username),
    enabled: !!username,
  });

  console.log({ user, username });

  // useEffect(()=>{
  //   if(data?.user){
  //     setCurrentUser(data.user)
  //   }else{
  //     setCurrentUser(null)
  //   }
  // },[data])

  if (!user) return notFound();

  return (
    <div className="h-full flex flex-col justify-between">
      {/* header */}
      <section className="p-4 flex items-center justify-between gap-8 border-b border-b-border shadow">
        <Link href={`/user/` + user.id} className="flex items-center gap-2">
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

export default MessagesUsernamePage;
