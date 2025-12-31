"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { getNotificationText, playNotificationSound } from "@/helpers/utils";
import { getAuthUnreadCounts, markAllNotificationsAsRead } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { NotificationDataType } from "@/types";

const socket = io({
  autoConnect: false,
});

// type
type SocketContextType = {
  onlineUsers: string[];
  counts: { unreadNotifications: number; unreadMessages: number };
  setCounts: (counts: {
    unreadNotifications: number;
    unreadMessages: number;
  }) => void;
  handleNotification: (value: {
    recipientId: string;
    data: NotificationDataType;
  }) => void;
};

// context
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [counts, setCounts] = useState({
    unreadNotifications: 0,
    unreadMessages: 0,
  });

  // connect
  const { auth } = useAuthContext();
  useEffect(() => {
    if (auth && !socket.connected) {
      socket.auth = {
        userId: auth.id,
      };
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [auth]);

  useEffect(() => {
    const handleOnlineUsers = (value: string[]) => {
      setOnlineUsers(value);
    };
    const handleNotification = (value: NotificationDataType) => {
      if (pathname !== `/notifications`) {
        setCounts((prev) => ({
          ...prev,
          unreadNotifications: prev.unreadNotifications + 1,
        }));
      }

      const messages = `${value.issuer.name} ${getNotificationText(
        value.type
      )}`;

      playNotificationSound();

      toast(messages, {
        position: "bottom-right",
      });
    };

    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("sendNotification", handleNotification);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("sendNotification", handleNotification);
    };
  }, [pathname]);

  const handleNotification = ({
    recipientId,
    data,
  }: {
    recipientId: string;
    data: NotificationDataType;
  }) => {
    socket.emit("sendNotification", {
      recipientId,
      data,
    });
  };

  useEffect(() => {
    if (auth) {
      const initCounts = async () => {
        const res = await getAuthUnreadCounts();
        setCounts(res);
      };
      initCounts();
    }
  }, [auth]);
  useEffect(() => {
    if (pathname === `/notifications` && counts.unreadNotifications) {
      (async () => {
        await markAllNotificationsAsRead();
        setCounts((prev) => ({ ...prev, unreadNotifications: 0 }));
      })();
    }
  }, [pathname, counts]);

  return (
    <SocketContext.Provider
      value={{ onlineUsers, counts, setCounts, handleNotification }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw Error(`useSocketContext not working!`);

  return ctx;
};
