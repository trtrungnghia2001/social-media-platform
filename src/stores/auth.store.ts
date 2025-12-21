import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { user } from "../data";

export type AuthType = {
  _id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  websiteUrl?: string;
};
type AuthStoreType = {
  auth: AuthType | null;
  setAuth: (auth: AuthType) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      (set) => ({
        auth: user,
        setAuth: (auth) => {
          set({ auth: auth });
        },
        logout: () => {
          set({ auth: null });
        },
      }),
      {
        name: "auth-state",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
