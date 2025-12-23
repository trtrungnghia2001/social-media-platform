"use client";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { MOCK_CONTACTS } from "@/src/data";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const MessageHeader = () => {
  const params = useParams();
  const username = params.username;
  const currentUser = MOCK_CONTACTS.find((c) => c.id === username);
  return (
    <div className="p-4 border-b border-b-border">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            history.back();
          }}
          className="rounded-full overflow-hidden bg-secondary-bg p-2 lg:hidden"
        >
          <ArrowLeft size={18} />
        </button>
        <Image
          alt="avatar"
          src={currentUser?.avatarUrl || IMAGES_DEFAULT.AVATAR}
          width={40}
          height={40}
          className="object-cover object-center rounded-full"
        />
        <div>
          <h4 className="font-bold">{currentUser?.name}</h4>
          <p className="text-xs text-secondary">@{currentUser?.username}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
