import { create } from "zustand";
import { AuthType } from "./auth.store";

export type PostType = {
  id: string;
  author: AuthType;
  context: string;
  mediaUrl: string;
  totalComments: number;
  totalShares: number;
  totalFavorites: number;
  isShare: boolean;
  isFavorite: boolean;
  isBookmark: boolean;
  createdAt: string;
};

type PostStoreType = {
  posts: PostType[];
  create: ({ content, files }: { content: string; files: FileList }) => void;
};

export const usePostStore = create<PostStoreType>()((set, get) => ({
  posts: [],
  create: (data) => {
    set({
      // posts: [data, ...get().posts],
    });
  },
}));
