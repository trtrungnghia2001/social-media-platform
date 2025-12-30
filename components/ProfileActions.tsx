"use client";

import { ComponentProps, memo, useState } from "react";
import clsx from "clsx";
import { User } from "@/app/generated/prisma/client";
import ProfileFormModal from "./ProfileFormModal";
import { useSocketContext } from "@/contexts/SocketContext";
import { Loader } from "lucide-react";
import { toggleFollow } from "@/lib/actions";
import Link from "next/link";

type ProfileActionsType = ComponentProps<"div"> & {
  auth: User;
  user: User;
  isFollowing: boolean;
};
const ProfileActions = ({
  auth,
  user,
  isFollowing,
  className,
  ...props
}: ProfileActionsType) => {
  const { handleNotification } = useSocketContext();

  const [open, setOpen] = useState(false);

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

  if (!auth) return null;

  return (
    <>
      {open && <ProfileFormModal open={open} setOpen={setOpen} user={auth} />}

      <div
        className={clsx(`flex-1 flex justify-end flex-wrap gap-2`, className)}
        {...props}
      >
        {user.username === auth?.username ? (
          <>
            <button
              onClick={() => setOpen(true)}
              className="block btn font-bold"
            >
              Edit profile
            </button>
          </>
        ) : (
          <>
            <Link href={`/messages/` + user.username}>
              <button className="block btn font-bold">Message</button>
            </Link>
            <button className="block btn font-bold" onClick={handleFollow}>
              {isloading ? (
                <Loader size={16} className="animate-spin" />
              ) : isFollowing ? (
                `Following`
              ) : (
                `Follow`
              )}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default memo(ProfileActions);
