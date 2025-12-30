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
import { toggleBookmark, toggleLike } from "@/lib/actions";
import toast from "react-hot-toast";
import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthContext } from "@/contexts/AuthContext";

type ActionType = "bookmark" | "like" | "share" | "comment" | "chart";

const PostCardAction = ({ post }: { post: PostDataType }) => {
  const actionRender = useMemo(() => {
    return [
      {
        label: "comment",
        icon: MessageCircle,
        total: post._count.comments,
      },
      {
        label: "share",
        icon: Repeat,
        total: post._count.shares,
        checked: post.isShared,
        color: "text-green-500",
      },
      {
        label: "like",
        icon: Heart,
        total: post._count.likes,
        checked: post.isLiked,
        color: "text-pink-500",
      },
      {
        label: "chart",
        icon: ChartNoAxesColumn,
        total: `25N`,
      },
    ];
  }, [post]);

  const { auth } = useAuthContext();
  const { handleNotification } = useSocketContext();

  const handleAction = async (type: ActionType) => {
    if (!auth) return;

    try {
      if (type === "like") {
        const data = await toggleLike(post.id);
        if (data) {
          handleNotification({
            recipientId: post.authorId,
            data: data,
          });
        }
      }
      if (type === "bookmark") {
        await toggleBookmark(post.id);
      }
    } catch (error) {
      toast.error(`Action failed!`);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between text-13 text-secondary gap-2">
      {actionRender.map((item, idx) => (
        <button
          onClick={() => handleAction(item.label as ActionType)}
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
          onClick={() => handleAction("bookmark")}
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
