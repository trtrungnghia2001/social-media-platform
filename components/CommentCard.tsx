"use client";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { CommentDataType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import OnlineStatus from "./OnlineStatus";
import { formatTimeAgo } from "@/helpers/utils";
import { Ellipsis } from "lucide-react";
import CommentCardAction from "./CommentCardAction";
import CommentForm from "./form/CommentForm";
import { useCommentContext } from "@/contexts/CommentContext";

const CommentCard = ({ comment }: { comment: CommentDataType }) => {
  const authorUrl = `/user/` + comment.author.username;

  const [openForm, setOpenForm] = useState(false);

  const { getReplies } = useCommentContext();

  return (
    <>
      <div className="flex items-start gap-4 border-t border-t-border p-4 hover:bg-secondaryBg transition-all">
        <Link href={authorUrl} className="relative">
          <Image
            alt="avatar"
            src={comment.author.avatarUrl || IMAGE_DEFAULT.AVATAR}
            loading="lazy"
            width={40}
            height={40}
            className="img rounded-full overflow-hidden"
          />
          <OnlineStatus userId={comment.author.id} />
        </Link>
        <div className="flex-1 space-y-2">
          {/* author */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>
                <Link href={authorUrl}>{comment.author.name}</Link>
              </h3>
              <p className="space-x-1 text-13 text-secondary">
                <span>@{comment.author.username}</span>
                <span>·</span>
                <span>{formatTimeAgo(new Date(comment.createdAt))}</span>
              </p>
            </div>
            <button className="btn-options">
              <Ellipsis size={16} />
            </button>
          </div>
          {/* content */}
          {comment.text && (
            <div
              dangerouslySetInnerHTML={{ __html: comment.text }}
              className="whitespace-break-spaces"
            ></div>
          )}
          {comment.mediaUrl && (
            <Image
              alt={comment.mediaUrl}
              src={comment.mediaUrl}
              loading="lazy"
              width={256}
              height={256}
              unoptimized
              className="h-auto rounded-lg"
            />
          )}
          {/* action */}
          <CommentCardAction
            comment={comment}
            setOpenForm={() => setOpenForm(!openForm)}
          />
        </div>
      </div>
      {/* form */}
      {openForm && (
        <CommentForm postId={comment.postId} parentCommentId={comment.id} />
      )}
      {/* replies */}
      {getReplies.length > 0 && (
        <div className="pl-14">
          {getReplies(comment.id).map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </>
  );
};

export default memo(CommentCard);
