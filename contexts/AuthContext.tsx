"use client";
import { User } from "@/app/generated/prisma/client";
import { getOptionalAuth } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  auth: User | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const { isSignedIn } = useUser();
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getOptionalAuth();
      setAuth(user);
    })();
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw Error(`useAuthContext not working!`);

  return ctx;
};
