"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./SocketContext";
import { AuthProvider } from "./AuthContext";
import { CommentProvider } from "./CommentContext";

export const queryClient = new QueryClient();

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <AuthProvider>
          <SocketProvider>
            <CommentProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </CommentProvider>
          </SocketProvider>
        </AuthProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default Provider;
