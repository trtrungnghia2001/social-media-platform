"use client";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

const socket = io({
  autoConnect: false,
});

// type
type SocketContextType = {
  onlineUsers: string[];
};

// context
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([
    `user_1`,
    `user_3`,
  ]);

  const { user, isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn && !socket.connected) {
      socket.auth = {
        userId: user.id,
      };
      socket.connect();
    }
  }, [isSignedIn, user]);

  return (
    <SocketContext.Provider value={{ onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw Error(`useSocketContext not working!`);

  return ctx;
};
