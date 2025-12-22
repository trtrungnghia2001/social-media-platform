import React, { memo } from "react";
import { PostType } from "../stores/post.store";
import Image from "next/image";
import {
  MessageCircle,
  Repeat,
  Heart,
  BarChart2,
  Bookmark,
  Share,
  Ellipsis,
} from "lucide-react";
import { IMAGES_DEFAULT } from "../constants/img";
import { formatTimeAgo } from "../utils/time";

const PostCard = ({ post }: { post: PostType }) => {
  return (
    <div className="border-t border-border flex items-start gap-4 p-4 hover:bg-secondary-bg">
      <div className="relative w-10 aspect-square overflow-hidden rounded-full">
        <Image
          src={post.author.avatarUrl || IMAGES_DEFAULT.AVATAR}
          alt="avatar"
          fill
          loading="lazy"
        />
      </div>
      {/* main */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* author */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-x-2">
            <span className="font-bold">{post.author.name}</span>
            <span className="text-secondary">
              {formatTimeAgo(post.createdAt)}
            </span>
            <p>
              <span className="text-secondary">@{post.author.username}</span>
            </p>
          </div>
          <button>
            <Ellipsis size={18} />
          </button>
        </div>
        {post.context && (
          <div dangerouslySetInnerHTML={{ __html: post.context }}></div>
        )}
        {post.mediaUrl && (
          <Image
            key={post.mediaUrl}
            src={post.mediaUrl}
            alt={post.mediaUrl}
            width={256}
            height={256}
            unoptimized
            className="rounded-lg"
          />
        )}
        {/* action */}
        <div className="text-secondary flex justify-between gap-4">
          <button className="flex items-center gap-1">
            <MessageCircle size={18} />
            {post.totalComments}
          </button>
          <button className="flex items-center gap-1">
            <Repeat
              size={18}
              className={post.isShare ? `text-green-500` : ``}
            />
            {post.totalShares}
          </button>
          <button className="flex items-center gap-1">
            <Heart
              size={18}
              className={post.isFavorite ? `text-pink-500` : ``}
            />
            {post.totalFavorites}
          </button>
          <button>
            <BarChart2 size={18} />
          </button>
          <div className="space-x-1">
            <button>
              <Bookmark
                size={18}
                className={post.isFavorite ? `text-blue-500` : ``}
              />
            </button>
            <button>
              <Share size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PostCard);
