"use client";
import MessageSidebarLeft from "@/components/layout/MessageSidebarLeft";
import { useSocketContext } from "@/contexts/SocketContext";
import clsx from "clsx";
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
  }, [username, setCurrentUser]);

  return (
    <div className="h-[calc(100vh-56px)] md:h-screen flex items-stretch overflow-y-hidden">
      <MessageSidebarLeft
        className={clsx(username ? "hidden xl:flex" : "flex")}
      />

      <section
        className={clsx(
          "flex-1 h-full bg-background",
          !username ? "hidden xl:block" : "block"
        )}
      >
        {children}
      </section>
    </div>
  );
};

export default Layout;
