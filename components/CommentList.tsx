"use client";
import { useCommentContext } from "@/contexts/CommentContext";
import CommentCard from "./CommentCard";
import { CommentDataType } from "@/types";
import { useEffect } from "react";

const CommentList = ({ comments }: { comments: CommentDataType[] }) => {
  const { setAllComments, getComments, getReplies } = useCommentContext();
  useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  return (
    <div>
      {getComments.length === 0 && (
        <div className="text-center text-secondary p-4">No comment</div>
      )}
      {getComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={{
            ...comment,
            _count: { replies: getReplies(comment.id).length },
          }}
        />
      ))}
    </div>
  );
};

export default CommentList;
