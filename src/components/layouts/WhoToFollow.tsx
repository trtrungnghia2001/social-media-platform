import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
export type WhoToFollowType = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
};

export const MOCK_WHO_TO_FOLLOW: WhoToFollowType[] = [
  {
    id: "u1",
    name: "Nghia Tran",
    username: "@nghiatran",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "u2",
    name: "Phuong Le",
    username: "@phuongle",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "u3",
    name: "Minh Nguyen",
    username: "@minhdev",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
  },
];

const WhoToFollow = () => {
  return (
    <div className="border border-border rounded-lg bg-background">
      <h3 className="p-4 font-semibold text-base">Who to follow</h3>
      {MOCK_WHO_TO_FOLLOW.slice(0, 4).map((user) => (
        <div
          key={user.id}
          className="cursor-pointer px-4 py-2 transition hover:bg-secondary-bg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />

            <div>
              <p className="font-semibold leading-none">{user.name}</p>
              <p className="text-sm text-secondary">{user.username}</p>
            </div>
          </div>

          <button className="btn text-13 font-bold">Follow</button>
        </div>
      ))}
      <div>
        <Link
          href={`/`}
          className="p-4 hover:bg-secondary-bg w-full block text-blue-500"
        >
          Show more
        </Link>
      </div>
    </div>
  );
};

export default memo(WhoToFollow);
