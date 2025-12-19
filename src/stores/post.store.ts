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
};

type PostStoreType = {
  posts: PostType[];
  create: (data: Partial<PostType>) => void;
};

export const usePostStore = create<PostStoreType>()((set, get) => ({
  posts: [],
  create: (data) => {
    set({
      //   posts: [data, ...get().posts],
    });
  },
}));
