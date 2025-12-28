import { User } from "@/app/generated/prisma/client";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import Image from "next/image";
import { memo } from "react";

const UserCard = ({ user }: { user: User }) => {
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
      <button className="btn font">Follow</button>
    </div>
  );
};

export default memo(UserCard);
