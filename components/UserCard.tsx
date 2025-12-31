"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { toggleFollow } from "@/lib/actions";
import { UserDataType } from "@/types";
import { Loader } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";

const UserCard = ({ user }: { user: UserDataType }) => {
  const { auth } = useAuthContext();
  const { handleNotification } = useSocketContext();
  const [isloading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setIsLoading(true);

      const data = await toggleFollow(user.id);
      if (data) {
        handleNotification({ recipientId: user.id, data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-3 px-4 hover:bg-secondaryBg flex items-start gap-4">
      <div className="flex-1 flex items-center gap-2">
        <Image
          width={40}
          height={40}
          alt="avatar"
          src={IMAGE_DEFAULT.AVATAR}
          loading="lazy"
          className="rounded-full overflow-hidden"
        />
        <div>
          <h3>{user.name}</h3>
          <p className="text-13 text-secondary">@{user.username}</p>
        </div>
      </div>
      {auth && (
        <button className="block btn font-bold" onClick={handleFollow}>
          {isloading ? (
            <Loader size={16} className="animate-spin" />
          ) : user.isFollowing ? (
            `Following`
          ) : (
            `Follow`
          )}
        </button>
      )}
    </div>
  );
};

export default memo(UserCard);
