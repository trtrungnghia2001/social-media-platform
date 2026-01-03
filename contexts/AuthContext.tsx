"use client";
import { User } from "@/app/generated/prisma/client";
import { syncAndGetAuth } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

export const socket = io({
  autoConnect: false,
});

type AuthContextType = {
  auth: User | null;
  setAuth: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const { isSignedIn, user } = useUser();
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchUser = async () => {
      if (!isSignedIn || !user) {
        setAuth(null);
        return;
      }

      console.log("Đang lấy data user từ DB...");
      const dbUser = await syncAndGetAuth(JSON.parse(JSON.stringify(user)));

      if (dbUser) {
        if (isMounted) setAuth(dbUser);
      } else if (retryCount < maxRetries) {
        // Nếu chưa thấy user (có thể do Webhook chậm), đợi 1.5s rồi thử lại
        retryCount++;
        console.log(`Chưa thấy user trong DB, thử lại lần ${retryCount}...`);
        setTimeout(fetchUser, 1500);
      } else {
        // Sau 3 lần vẫn không thấy -> Có thể lỗi Webhook thật hoặc cần Onboarding
        if (isMounted) setAuth(null);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user]);

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

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw Error(`useAuthContext not working!`);

  return ctx;
};
