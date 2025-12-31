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

  return (
    <CommentContext.Provider
      value={{ getComments, getReplies, setAllComments }}
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
