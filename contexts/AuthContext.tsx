"use client";
import { User } from "@/app/generated/prisma/client";
import { getOptionalAuth } from "@/lib/actions";
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
  const { isSignedIn } = useUser();
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      if (isSignedIn) {
        const user = await getOptionalAuth();
        setAuth(user);
      } else {
        setAuth(null);
      }
    })();
  }, [isSignedIn]);
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
