import { createContext, useContext, useState } from "react";
import { AuthType } from "../stores/auth.store";

type SocketContextType = {
  handleShare: () => void;
  handleFavorite: () => void;
  handleBookmark: () => void;
  handleMessage: () => void;
  currentUser: AuthType | null;
  onlineUsers: string[];
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const handleShare = () => {};
  const handleFavorite = () => {};
  const handleBookmark = () => {};
  const handleMessage = () => {};
  const [currentUser, setCurrentUser] = useState<AuthType | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([
    "u1",
    "u3",
    "u4",
    "u7",
    "u9",
  ]);

  return (
    <SocketContext.Provider
      value={{
        handleShare,
        handleFavorite,
        handleBookmark,
        handleMessage,
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
