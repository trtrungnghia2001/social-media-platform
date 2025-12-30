import { IMAGE_DEFAULT } from "@/helpers/constants";
import { formatTimeAgo } from "@/helpers/utils";
import { PostDataType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import PostCardAction from "./PostCardAction";
import OnlineStatus from "./OnlineStatus";
import { Ellipsis } from "lucide-react";

const PostCard = ({ post }: { post: PostDataType }) => {
  const authorUrl = `/user/` + post.author.username;

  return (
    <div className="flex items-start gap-4 border-t border-t-border p-4 hover:bg-secondaryBg transition-all">
      <Link href={authorUrl} className="relative">
        <Image
          alt="avatar"
          src={post.author.avatarUrl || IMAGE_DEFAULT.AVATAR}
          loading="lazy"
          width={40}
          height={40}
          className="img rounded-full overflow-hidden"
        />
        <OnlineStatus userId={post.author.id} />
      </Link>
      <div className="flex-1 space-y-2">
        {/* author */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3>
              <Link href={authorUrl}>{post.author.name}</Link>
            </h3>
            <p className="space-x-1 text-13 text-secondary">
              <span>@{post.author.username}</span>
              <span>·</span>
              <span>{formatTimeAgo(new Date(post.createdAt))}</span>
            </p>
          </div>
          <button className="btn-options">
            <Ellipsis size={16} />
          </button>
        </div>
        {/* content */}
        {post.text && (
          <div
            dangerouslySetInnerHTML={{ __html: post.text }}
            className="whitespace-break-spaces"
          ></div>
        )}
        {post.mediaUrl && (
          <Image
            alt={post.mediaUrl}
            src={post.mediaUrl}
            loading="lazy"
            width={256}
            height={256}
            unoptimized
            className="h-auto rounded-lg"
          />
        )}
        {/* action */}
        <PostCardAction post={post} />
      </div>
    </div>
  );
};

export default memo(PostCard);
