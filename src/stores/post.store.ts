import { create } from "zustand";
import { AuthType, useAuthStore } from "./auth.store";
import { createPost } from "@/lib/post";

export type PostType = {
  id: string;
  author: AuthType;
  content?: string;
  mediaUrl?: string;
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
  create: (data: {
    authorId: string;
    content?: string;
    mediaUrl?: string;
  }) => Promise<void>;
};

export const usePostStore = create<PostStoreType>()((set, get) => ({
  posts: [],
  create: async (data) => {
    const resp = await createPost(data);
    const newPost: PostType = {
      ...resp,
      id: resp.id,
      author: useAuthStore.getState().auth as AuthType,
      content: resp.content || "",
      mediaUrl: resp.mediaUrl || "",
      totalComments: 0,
      totalShares: 0,
      totalFavorites: 0,
      isShare: false,
      isFavorite: false,
      isBookmark: false,
      createdAt: resp.createdAt.toISOString(),
    };
    set({
      posts: [newPost, ...get().posts],
    });
  },
}));
