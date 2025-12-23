"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./useTheme";
import { memo } from "react";
import { SocketProvider } from "./useSocket";
import { AuthProvider } from "./AuthProvider";

export const queryClient = new QueryClient();

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </SocketProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default memo(Provider);
