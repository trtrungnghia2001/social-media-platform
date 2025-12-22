import { createContext, useContext } from "react";

type SocketContextType = {
  handleShare: () => void;
  handleFavorite: () => void;
  handleBookmark: () => void;
  handleMessage: () => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const handleShare = () => {};
  const handleFavorite = () => {};
  const handleBookmark = () => {};
  const handleMessage = () => {};
  return (
    <SocketContext.Provider
      value={{ handleShare, handleFavorite, handleBookmark, handleMessage }}
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
