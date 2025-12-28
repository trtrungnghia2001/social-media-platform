"use client";

import { IMAGE_DEFAULT } from "@/helpers/constants";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import InputSearch from "../form/InputSearch";

// Type cho phần Xu hướng (Trends)
export type TrendType = {
  category: string;
  title: string;
  postCount?: string; // Ví dụ: "226 N bài đăng"
};

// Type cho phần Gợi ý theo dõi (Who to follow)
export type RecommendationType = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified?: boolean;
};

export const trendingData: TrendType[] = [
  {
    category: "Music · Trending",
    title: "#MCJAEMINxSBSGAYODAEJEON",
    postCount: "84.4K posts",
  },
  {
    category: "Business & Finance · Trending",
    title: "Bitcoin",
    postCount: "226K posts",
  },
  { category: "Trending in Vietnam", title: "human whale" },
  { category: "Trending in Vietnam", title: "#creatorlife" },
];

export const recommendations: RecommendationType[] = [
  {
    id: "1",
    name: "Mirko Kiefer",
    handle: "@mirkokiefer",
    avatarUrl: "/avatar1.png",
  },
  {
    id: "2",
    name: "ONE Championship",
    handle: "@ONEChampionship",
    avatarUrl: "/avatar2.png",
    isVerified: true,
  },
];

const SidebarRight = () => {
  return (
    <aside className="w-xs pt-4 space-y-4 hidden xl:block">
      <InputSearch />
      <section className="border border-border rounded-lg py-4">
        <h2 className="px-4 mb-4">What&apos;s happening</h2>
        <ul>
          {trendingData.map((trend, idx) => (
            <li
              key={idx}
              className="py-2 px-4 hover:bg-secondaryBg flex items-start gap-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-13 text-secondary">{trend.category}</p>
                <h3>{trend.title}</h3>
                <p className="text-13 text-secondary">{trend.postCount}</p>
              </div>
              <button className="btn-options">
                <Ellipsis size={16} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="border border-border rounded-lg py-4">
        <h2 className="px-4 mb-4">Recommendations</h2>
        <ul>
          {recommendations.map((recom, idx) => (
            <li
              key={idx}
              className="py-2 px-4 hover:bg-secondaryBg flex items-start gap-4"
            >
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
                  <h3>{recom.name}</h3>
                  <p className="text-13 text-secondary">@{recom.handle}</p>
                </div>
              </div>
              <button className="btn font">Follow</button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default SidebarRight;
