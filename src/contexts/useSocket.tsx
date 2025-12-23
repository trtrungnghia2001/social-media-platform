"use client";

import { io } from "socket.io-client";

const socket = io({
  autoConnect: false,
});

import { createContext, useContext, useEffect, useState } from "react";
import { AuthType, useAuthStore } from "../stores/auth.store";
import { InteractionType } from "@/app/generated/prisma";

type SocketContextType = {
  handlePostActive: (data: {
    postId: string;
    userId: string;
    type: InteractionType;
  }) => void;
  handleMessage: () => void;
  notifications: number;
  setNotifications: (notifications: number) => void;
  currentUser: AuthType | null;
  onlineUsers: string[];
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [currentUser, setCurrentUser] = useState<AuthType | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<number>(0);

  const handlePostActive = (data: {
    postId: string;
    userId: string;
    type: InteractionType;
  }) => {
    socket.emit("post-active", data);
  };
  const handleMessage = () => {};

  // connect
  const { auth } = useAuthStore();
  useEffect(() => {
    if (auth?.id) {
      socket.auth = { authId: auth.id };
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [auth?.id]);

  // event
  useEffect(() => {
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    socket.on("onlineUsers", handleOnlineUsers);

    const handlePostActive = () => {
      setNotifications((prev) => prev + 1);
    };
    socket.on("post-active", handlePostActive);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("post-active", handlePostActive);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        handleMessage,
        handlePostActive,
        notifications,
        setNotifications,
        currentUser,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw Error("useSocket not working");
  }
  return ctx;
};
