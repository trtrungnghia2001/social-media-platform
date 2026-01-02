"use client";
import { PostDataType } from "@/types";
import { memo } from "react";
import {
  MessageCircle,
  Heart,
  Repeat,
  ChartNoAxesColumn,
  Bookmark,
  ArrowUpFromLine,
} from "lucide-react";
import clsx from "clsx";
import { toggleBookmark, toggleLike } from "@/lib/actions";
import toast from "react-hot-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { NotificationType } from "@/app/generated/prisma";
import PostOptions from "./PostOptions";

type ActionType = keyof typeof NotificationType | "BOOKMARK";

const PostCardAction = ({ post }: { post: PostDataType }) => {
  const { auth } = useAuthContext();
  const { handleNotification } = useSocketContext();

  const handleAction = async (type: ActionType) => {
    if (!auth) {
      toast.error(`Please log in!`);
      return;
    }

    try {
      if (type === "LIKE") {
        const data = await toggleLike(post.id);
        if (data) {
          handleNotification({
            recipientId: post.authorId,
            data: data,
          });
        }
      }
      if (type === "BOOKMARK") {
        await toggleBookmark(post.id);
      }
    } catch (error) {
      toast.error(`Action failed!`);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between text-13 text-secondary gap-2">
      <Link
        href={`/status/` + post.id}
        className={clsx(`flex items-center gap-1`)}
      >
        <MessageCircle size={16} />
        {post._count.comments}
      </Link>
      <button
        className={clsx(
          `flex items-center gap-1`,
          post.isShared ? `text-green-500` : `text-inherit`
        )}
      >
        <Repeat size={16} />
        {post._count.comments}
      </button>
      <button
        onClick={() => handleAction("LIKE")}
        className={clsx(
          `flex items-center gap-1`,
          post.isLiked ? `text-pink-500` : `text-inherit`
        )}
      >
        <Heart size={16} />
        {post._count.likes}
      </button>
      <button className={clsx(`flex items-center gap-1`)}>
        <ChartNoAxesColumn size={16} />
        25N
      </button>
      {/* right */}
      <div className="space-x-2">
        <button
          onClick={() => handleAction("BOOKMARK")}
          className={post.isBookmarked ? `text-blue-500` : `text-inherit`}
        >
          <Bookmark size={16} />
        </button>
        <PostOptions post={post} />
        <button>
          <ArrowUpFromLine size={16} />
        </button>
      </div>
    </div>
  );
};

export default memo(PostCardAction);
