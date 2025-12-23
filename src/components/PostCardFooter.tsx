import React, { memo, useEffect, useState } from "react";
import { PostType } from "../stores/post.store";
import {
  MessageCircle,
  Repeat,
  Heart,
  BarChart2,
  Bookmark,
  Share,
} from "lucide-react";
import { useSocket } from "../contexts/useSocket";
import { useAuthStore } from "../stores/auth.store";
import { useMutation } from "@tanstack/react-query";
import { InteractionType } from "@/app/generated/prisma";
import { activePost } from "@/lib/post";
import toast from "react-hot-toast";

const PostCardFooter = ({ post }: { post: PostType }) => {
  const { handlePostActive } = useSocket();

  const { auth } = useAuthStore();
  const { mutate, isPending } = useMutation({
    mutationFn: async (activeType: InteractionType) => {
      if (!auth) return;
      return await activePost({
        postId: post.id,
        userId: auth.id,
        type: activeType,
      });
    },
    onMutate: async (activeType) => {
      // 1. Lưu lại state cũ để rollback nếu lỗi
      const previousState = activeState;

      // 2. Cập nhật UI ngay lập tức
      const isCurrentlyActive =
        activeType === "FAVORITE"
          ? activeState.isFavorite
          : activeType === "BOOKMARK"
          ? activeState.isBookmark
          : activeState.isShare;

      const change = isCurrentlyActive ? -1 : 1;
      console.log({ isCurrentlyActive, change });

      setActiveState((prev) => ({
        ...prev,
        isFavorite:
          activeType === "FAVORITE" ? !prev.isFavorite : prev.isFavorite,
        totalFavorites:
          activeType === "FAVORITE"
            ? prev.totalFavorites + change
            : prev.totalFavorites,
        isBookmark:
          activeType === "BOOKMARK" ? !prev.isBookmark : prev.isBookmark,
        isShare: activeType === "SHARE" ? !prev.isShare : prev.isShare,
        totalShares:
          activeType === "SHARE" ? prev.totalShares + change : prev.totalShares,
      }));

      return { previousState };
    },
    onSuccess: (data) => {
      if (data?.action === "added") {
        handlePostActive({
          postId: post.id,
          userId: post.author.id,
          type: data?.type as InteractionType,
        });

        toast.success(`Added ` + data?.type + ` successfully!`);
      }
      if (data?.action === "removed") {
        toast.success(`Removed ` + data?.type + ` successfully!`);
      }
    },

    onError: (err, variables, context) => {
      if (context?.previousState) setActiveState(context.previousState);
      toast.error("Something went wrong!");
    },
  });

  const [activeState, setActiveState] = useState<{
    isBookmark: boolean;
    isShare: boolean;
    isFavorite: boolean;
    totalShares: number;
    totalFavorites: number;
  }>({
    isBookmark: false,
    isShare: false,
    isFavorite: false,
    totalShares: 0,
    totalFavorites: 0,
  });
  useEffect(() => {
    setActiveState({
      isBookmark: post.isBookmark,
      isShare: post.isShare,
      isFavorite: post.isFavorite,
      totalShares: post.totalShares,
      totalFavorites: post.totalFavorites,
    });
  }, [post]);

  return (
    <div className="text-secondary flex justify-between gap-4">
      <button className="flex items-center gap-1">
        <MessageCircle size={18} />
        {post.totalComments}
      </button>
      <button
        className="flex items-center gap-1"
        onClick={() => mutate("SHARE")}
      >
        <Repeat
          size={18}
          className={activeState.isShare ? `text-green-500` : ``}
        />
        {activeState.totalShares}
      </button>
      <button
        className="flex items-center gap-1"
        onClick={() => mutate("FAVORITE")}
      >
        <Heart
          size={18}
          className={activeState.isFavorite ? `text-pink-500` : ``}
        />
        {activeState.totalFavorites}
      </button>
      <button>
        <BarChart2 size={18} />
      </button>
      <div className="space-x-1">
        <button>
          <Bookmark
            size={18}
            onClick={() => mutate("BOOKMARK")}
            className={activeState.isBookmark ? `text-blue-500` : ``}
          />
        </button>
        <button>
          <Share size={18} />
        </button>
      </div>
    </div>
  );
};

export default memo(PostCardFooter);
