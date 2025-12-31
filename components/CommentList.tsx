"use client";
import { useCommentContext } from "@/contexts/CommentContext";
import CommentCard from "./CommentCard";
import { CommentDataType } from "@/types";
import { useEffect } from "react";

const CommentList = ({ comments }: { comments: CommentDataType[] }) => {
  const { setAllComments, getComments } = useCommentContext();
  useEffect(() => {
    setAllComments(comments);
  }, [comments]);

  return (
    <div>
      {getComments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
