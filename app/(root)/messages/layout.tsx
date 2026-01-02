"use client";
import MessageSidebarLeft from "@/components/layout/MessageSidebarLeft";
import { useSocketContext } from "@/contexts/SocketContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { username } = useParams();
  const { setCurrentUser } = useSocketContext();

  useEffect(() => {
    if (!username) {
      setCurrentUser(null);
      return;
    }
  }, [username, username]);

  return (
    <div className="h-screen flex items-stretch">
      <MessageSidebarLeft />
      <section className="h-full flex-1">{children}</section>
    </div>
  );
};

export default Layout;
