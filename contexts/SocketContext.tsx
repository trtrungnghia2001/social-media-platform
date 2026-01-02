"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { socket, useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { getNotificationText, playNotificationSound } from "@/helpers/utils";
import { getAuthUnreadCounts, markAllNotificationsAsRead } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { MessageDataType, NotificationDataType, UserDataType } from "@/types";
import { queryClient } from "./Provider";

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
  messages: MessageDataType[];
  setMessages: Dispatch<SetStateAction<MessageDataType[]>>;
  setCurrentUser: Dispatch<SetStateAction<UserDataType | null>>;
  currentUser: UserDataType | null;
  handleSendMessage: (mess: MessageDataType) => void;
};

// context
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  // state
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [counts, setCounts] = useState({
    unreadNotifications: 0,
    unreadMessages: 0,
  });
  const [currentUser, setCurrentUser] = useState<UserDataType | null>(null);
  const [messages, setMessages] = useState<MessageDataType[]>([]);

  const { auth } = useAuthContext();

  useEffect(() => {
    const handleOnlineUsers = (value: string[]) => {
      setOnlineUsers(value);
    };
    const handleNotification = (value: NotificationDataType) => {
      setCounts((prev) => ({
        ...prev,
        unreadNotifications: prev.unreadNotifications + 1,
      }));

      const messages = `${value.issuer.name} ${getNotificationText(
        value.type
      )}`;

      playNotificationSound();

      toast(messages, {
        position: "bottom-right",
      });
    };
    const handleReceiverMessage = (mess: MessageDataType) => {
      setMessages((prev) => [...prev, mess]);

      setCounts((prev) => ({
        ...prev,
        unreadMessages: prev.unreadMessages + 1,
      }));

      const messages = `${mess.sender.name} sent you a message`;

      playNotificationSound();

      toast(messages, {
        position: "bottom-left",
      });

      // cap nhat tin nhan moi
      queryClient.setQueryData(["users"], (oldData: UserDataType[] | null) => {
        if (!oldData) return oldData;
        return oldData.map((item) =>
          item.id === mess.senderId ? { ...item, lastMessage: mess } : item
        );
      });
    };

    // cap nhat lai users khi ho doc tin nhan
    const handleReadMessage = ({ readBy }: { readBy: string }) => {
      queryClient.setQueryData(["users"], (oldData: UserDataType[] | null) => {
        if (!oldData) return oldData;

        return oldData.map((u) =>
          u.id === readBy
            ? {
                ...u,
                lastMessage: u.lastMessage
                  ? {
                      ...u.lastMessage,
                      readBy: [...(u.lastMessage?.readBy as string[]), readBy],
                    }
                  : u.lastMessage,
              }
            : u
        );
      });
    };

    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("sendNotification", handleNotification);
    socket.on("receiver-message", handleReceiverMessage);
    socket.on("message-read", handleReadMessage);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("sendNotification", handleNotification);
      socket.off("receiver-message", handleReceiverMessage);
      socket.off("message-read", handleReadMessage);
    };
  }, []);

  // init count notifi and mess
  useEffect(() => {
    if (auth) {
      const initCounts = async () => {
        const res = await getAuthUnreadCounts();
        setCounts(res);
      };
      initCounts();
    }
  }, [auth]);
  // notifi
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
    if (pathname === `/notifications` && counts.unreadNotifications) {
      (async () => {
        await markAllNotificationsAsRead();
        setCounts((prev) => ({ ...prev, unreadNotifications: 0 }));
      })();
    }
  }, [pathname, counts]);

  // messages
  const handleSendMessage = (mess: MessageDataType) => {
    if (!currentUser) return;

    socket.emit("send-message", { receiverId: currentUser.id, mess });
    console.log({ mess });

    queryClient.setQueryData(["users"], (oldData: UserDataType[] | null) => {
      if (!oldData) return oldData;
      return oldData.map((item) =>
        item.id === mess.receiverId ? { ...item, lastMessage: mess } : item
      );
    });
  };

  // cap nhat users tin nhan moi va gui thong bao cho currentUser
  //  biet minh da doc tin nhan
  useEffect(() => {
    if (!currentUser) return;

    queryClient.setQueryData(["users"], (oldData: UserDataType[] | null) => {
      if (!oldData) return oldData;

      return oldData.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              lastMessage: u.lastMessage
                ? {
                    ...u.lastMessage,
                    readBy: [...(u.lastMessage?.readBy as string[]), auth?.id],
                  }
                : u.lastMessage,
            }
          : u
      );
    });

    socket.emit("mark-as-read", {
      senderId: auth?.id,
      receiverId: currentUser.id,
    });
  }, [currentUser, messages]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        counts,
        setCounts,
        handleNotification,
        messages,
        setMessages,
        handleSendMessage,
        setCurrentUser,
        currentUser,
      }}
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
