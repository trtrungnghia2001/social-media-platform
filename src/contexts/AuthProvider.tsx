"use client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth.store";
import { getUnreadCounts } from "@/lib/user";
import { useSocket } from "./useSocket";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { setAuth, logout } = useAuthStore();
  const { setNotifications } = useSocket();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const response = await axios.get("/api/me");
          const dbUser = await response.data;

          if (dbUser) {
            setAuth({
              id: dbUser.id,
              name: dbUser.name,
              username: dbUser.username,
              avatarUrl: dbUser.avatarUrl,
              backgroundUrl: dbUser.backgroundUrl,
              bio: dbUser.bio,
              websiteUrl: dbUser.websiteUrl,
            });

            const unreadCounts = await getUnreadCounts(dbUser.id);
            setNotifications(unreadCounts.unreadNotifications);
          }
        } catch (error) {
          console.error("Sync error:", error);
        }
      } else if (isLoaded && !isSignedIn) {
        logout();
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, setAuth, logout]);

  return <>{children}</>;
};
