"use client";
import { CommentDataType } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CommentContextType = {
  getReplies: (commentId: string) => CommentDataType[];
  getComments: CommentDataType[];
  setAllComments: Dispatch<SetStateAction<CommentDataType[]>>;
  deleteCommentId: (commentId: string) => void;
};
const CommentContext = createContext<CommentContextType | null>(null);

export const CommentProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [allComments, setAllComments] = useState<CommentDataType[]>([]);

  const getReplies = useCallback(
    (commentId: string) => {
      return allComments.filter(
        (comment) => comment.postId && comment.parentCommentId === commentId
      );
    },
    [allComments]
  );

  const getComments = useMemo(() => {
    return allComments.filter(
      (comment) => comment.postId && !comment.parentCommentId
    );
  }, [allComments]);

  const deleteCommentId = useCallback((commentId: string) => {
    setAllComments((prev) =>
      prev.filter((comment) => comment.id !== commentId)
    );
  }, []);

  return (
    <CommentContext.Provider
      value={{ getComments, getReplies, setAllComments, deleteCommentId }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const ctx = useContext(CommentContext);
  if (!ctx) throw Error(`useCommentContext not working!`);

  return ctx;
};
