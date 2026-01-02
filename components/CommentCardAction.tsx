"use client";
import { CommentDataType } from "@/types";
import { memo } from "react";
import { MessageCircle, Trash } from "lucide-react";
import { useCommentContext } from "@/contexts/CommentContext";
import { deleteCommentById } from "@/lib/actions";
import { useAuthContext } from "@/contexts/AuthContext";

const CommentCardAction = ({
  comment,
  setOpenForm,
}: {
  comment: CommentDataType;
  setOpenForm: () => void;
}) => {
  const { auth } = useAuthContext();
  const { deleteCommentId } = useCommentContext();
  return (
    <div>
      <div className="flex items-center text-13 text-secondary gap-4">
        <button onClick={setOpenForm}>
          <MessageCircle size={16} />
        </button>
        {auth?.id === comment.authorId && (
          <>
            <button
              onClick={async () => {
                deleteCommentId(comment.id);
                await deleteCommentById(comment.id);
              }}
            >
              <Trash size={16} />
            </button>
          </>
        )}
        <span>{comment._count.replies} replies</span>
      </div>
    </div>
  );
};

export default memo(CommentCardAction);
