import { IMAGES_DEFAULT } from "@/src/constants/img";
import { useAuthStore } from "@/src/stores/auth.store";
import Image from "next/image";

const MessageHeader = () => {
  const currentUser = useAuthStore.getState().auth;
  return (
    <div className="p-4 border-b border-b-border">
      <div className="flex items-center gap-2">
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
