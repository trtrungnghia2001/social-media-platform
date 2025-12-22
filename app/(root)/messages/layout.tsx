"use client";
import MessageSidebar from "@/src/components/layouts/MessageSidebar";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isChatting = pathname.split("/").length > 2;
  return (
    <div className="flex items-start">
      <MessageSidebar
        className={`${isChatting ? "hidden" : "block"} lg:block`}
      />
      <div
        className={`flex-1 h-screen ${
          isChatting ? "block" : "hidden"
        } lg:block`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
