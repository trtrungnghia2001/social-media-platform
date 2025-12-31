"use client";
import { CommentDataType } from "@/types";
import { memo } from "react";
import { MessageCircle, Heart } from "lucide-react";

const CommentCardAction = ({
  comment,
  setOpenForm,
}: {
  comment: CommentDataType;
  setOpenForm: () => void;
}) => {
  return (
    <div>
      <div className="flex items-center text-13 text-secondary gap-4">
        <button onClick={setOpenForm}>
          <MessageCircle size={16} />
        </button>
        <button>
          <Heart size={16} />
        </button>
        <button>{comment._count.replies} replies</button>
      </div>
    </div>
  );
};

export default memo(CommentCardAction);
