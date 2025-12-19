import Link from "next/link";
import React, { memo } from "react";
export type TrendingType = {
  id: string;
  category: string;
  title: string;
  posts: string;
};

export const MOCK_TRENDING: TrendingType[] = [
  {
    id: "t1",
    category: "Technology · Trending",
    title: "#NextJS",
    posts: "12.3K posts",
  },
  {
    id: "t2",
    category: "Programming · Trending",
    title: "#React",
    posts: "9.8K posts",
  },
  {
    id: "t3",
    category: "Web Development · Trending",
    title: "#TypeScript",
    posts: "7.2K posts",
  },
  {
    id: "t4",
    category: "Frontend · Trending",
    title: "#TailwindCSS",
    posts: "5.6K posts",
  },
  {
    id: "t5",
    category: "JavaScript · Trending",
    title: "#Zustand",
    posts: "3.9K posts",
  },
  {
    id: "t6",
    category: "Software · Trending",
    title: "#Prisma",
    posts: "4.1K posts",
  },
  {
    id: "t7",
    category: "DevLife · Trending",
    title: "#SideProjects",
    posts: "6.7K posts",
  },
];

const Trending = () => {
  return (
    <div className="border border-border rounded-lg bg-background">
      <h3 className="p-4 font-semibold text-base">What’s happening</h3>

      {MOCK_TRENDING.slice(0, 4).map((item) => (
        <div
          key={item.id}
          className="cursor-pointer px-4 py-2 transition hover:bg-secondary-bg"
        >
          <p className="text-xs text-secondary">{item.category}</p>
          <p className="font-semibold">{item.title}</p>
          <p className="text-xs text-secondary">{item.posts}</p>
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

export default memo(Trending);
