"use client";
import { PostDataType } from "@/types";
import { memo, useMemo } from "react";
import {
  MessageCircle,
  Heart,
  Repeat,
  ChartNoAxesColumn,
  Bookmark,
  ArrowUpFromLine,
} from "lucide-react";
import clsx from "clsx";

const PostCardAction = ({ post }: { post: PostDataType }) => {
  const actionRender = useMemo(() => {
    return [
      {
        icon: MessageCircle,
        total: post._count.comments,
      },
      {
        icon: Repeat,
        total: post._count.shares,
        checked: post.isShared,
        color: "text-green-500",
      },
      {
        icon: Heart,
        total: post._count.likes,
        checked: post.isLiked,
        color: "text-pink-500",
      },
      {
        icon: ChartNoAxesColumn,
        total: `25N`,
      },
    ];
  }, [post]);

  return (
    <div className="flex items-center justify-between text-13 text-secondary gap-2">
      {actionRender.map((item, idx) => (
        <button
          key={idx}
          className={clsx(
            `flex items-center gap-1`,
            item.checked ? item.color : `text-inherit`
          )}
        >
          <item.icon size={16} />
          {item.total && <span>{item.total}</span>}
        </button>
      ))}
      <div className="space-x-2">
        <button
          className={post.isBookmarked ? `text-blue-500` : `text-inherit`}
        >
          <Bookmark size={16} />
        </button>
        <button>
          <ArrowUpFromLine size={16} />
        </button>
      </div>
    </div>
  );
};

export default memo(PostCardAction);
