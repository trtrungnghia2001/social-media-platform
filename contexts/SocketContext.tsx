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
import {
  getAuthUnreadCounts,
  markAllNotificationsAsRead,
  readMessages,
} from "@/lib/actions";
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
  setSearchUser: Dispatch<SetStateAction<string>>;
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

    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("sendNotification", handleNotification);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("sendNotification", handleNotification);
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
    if (pathname === "/notifications") {
      const clearNotis = async () => {
        await markAllNotificationsAsRead();

        setCounts((prev) => {
          if (prev.unreadNotifications === 0) return prev;
          return { ...prev, unreadNotifications: 0 };
        });
      };

      clearNotis();
    }
  }, [pathname]);

  // messages
  const handleSendMessage = (mess: MessageDataType) => {
    if (!currentUser) return;

    socket.emit("send-message", { receiverId: currentUser.id, mess });
    console.log({ mess });

    queryClient.setQueryData(
      ["users", searchUser],
      (oldData: UserDataType[] | null) => {
        if (!oldData) return oldData;
        return oldData.map((item) =>
          item.id === mess.receiverId ? { ...item, lastMessage: mess } : item
        );
      }
    );
  };
  const [searchUser, setSearchUser] = useState("");

  // cap nhat users tin nhan moi va gui thong bao cho currentUser
  //  biet minh da doc tin nhan
  useEffect(() => {
    if (!currentUser) return;

    queryClient.setQueryData(
      ["users", searchUser],
      (oldData: UserDataType[] | null) => {
        if (!oldData) return oldData;

        return oldData.map((u) =>
          u.id === currentUser.id
            ? {
                ...u,
                lastMessage: u.lastMessage
                  ? {
                      ...u.lastMessage,
                      readBy: [
                        ...(u.lastMessage?.readBy as string[]),
                        auth?.id,
                      ],
                    }
                  : u.lastMessage,
              }
            : u
        );
      }
    );

    socket.emit("mark-as-read", {
      senderId: auth?.id,
      receiverId: currentUser.id,
    });
  }, [currentUser, messages, searchUser, auth]);

  useEffect(() => {
    const handleReceiverMessage = (mess: MessageDataType) => {
      setMessages((prev) => [...prev, mess]);

      if (currentUser?.id !== mess.senderId) {
        setCounts((prev) => ({
          ...prev,
          unreadMessages: prev.unreadMessages + 1,
        }));

        const messages = `${mess.sender.name} sent you a message`;
        playNotificationSound();
        toast(messages, {
          position: "bottom-left",
        });
      }

      // cap nhat tin nhan moi
      queryClient.setQueryData(
        ["users", searchUser],
        (oldData: UserDataType[] | null) => {
          if (!oldData) return oldData;

          const userIndex = oldData.findIndex((u) => u.id === mess.senderId);
          if (userIndex === -1) return oldData;

          const newData = [...oldData];
          // Cập nhật và đưa lên đầu
          const updatedUser = { ...newData[userIndex], lastMessage: mess };
          newData.splice(userIndex, 1);
          newData.unshift(updatedUser);

          return newData;
        }
      );
    };

    // cap nhat lai users khi ho doc tin nhan
    const handleReadMessage = ({ readBy }: { readBy: string }) => {
      queryClient.setQueryData(
        ["users", searchUser],
        (oldData: UserDataType[] | null) => {
          if (!oldData) return oldData;

          return oldData.map((u) =>
            u.id === readBy
              ? {
                  ...u,
                  lastMessage: u.lastMessage
                    ? {
                        ...u.lastMessage,
                        readBy: [
                          ...(u.lastMessage?.readBy as string[]),
                          readBy,
                        ],
                      }
                    : u.lastMessage,
                }
              : u
          );
        }
      );
    };

    socket.on("receiver-message", handleReceiverMessage);
    socket.on("message-read", handleReadMessage);

    return () => {
      socket.off("receiver-message", handleReceiverMessage);
      socket.off("message-read", handleReadMessage);
    };
  }, [searchUser, currentUser?.id]);

  useEffect(() => {
    if (!pathname.includes(`messages`) || !currentUser) return;

    const performRead = async () => {
      const megs = await readMessages(currentUser.id);

      if (megs.count === 0) return;

      setCounts((prev) => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - megs.count),
      }));
    };

    performRead();
  }, [pathname, currentUser?.id]);

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
        setSearchUser,
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
