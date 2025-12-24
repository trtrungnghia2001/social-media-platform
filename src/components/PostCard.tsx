"use client";
import { memo } from "react";
import { PostType } from "../stores/post.store";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import { IMAGES_DEFAULT } from "../constants/img";
import { formatTimeAgo } from "../utils/time";
import { useSocket } from "../contexts/useSocket";
import OnlineStatus from "./OnlineStatus";
import Link from "next/link";
import PostCardFooter from "./PostCardFooter";

const PostCard = ({ post }: { post: PostType }) => {
  const { onlineUsers } = useSocket();

  return (
    <div className="border-t border-border flex items-start gap-4 p-4 hover:bg-secondary-bg">
      <Link href={`/` + post.author.username} className="relative">
        <Image
          src={post.author.avatarUrl || IMAGES_DEFAULT.AVATAR}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full object-center object-cover overflow-hidden aspect-square"
          loading="lazy"
        />
        <OnlineStatus status={onlineUsers.includes(post.author.id)} />
      </Link>
      {/* main */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* author */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-x-2">
            <Link href={`/` + post.author.username} className="font-bold">
              {post.author.name}
            </Link>
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
        {post.content && (
          <div
            className="whitespace-break-spaces"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
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
        <PostCardFooter post={post} />
      </div>
    </div>
  );
};

export default memo(PostCard);
