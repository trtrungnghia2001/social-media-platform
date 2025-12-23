"use client";
import MobileNav from "@/src/components/layouts/MobileNav";
import Sidebar from "@/src/components/layouts/Sidebar";
import SidebarRight from "@/src/components/layouts/SidebarRight";
import { usePathname } from "next/navigation";
import React from "react";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <>
      <div className="max-w-7xl w-full mx-auto flex items-start mb-16 sm:mb-0">
        <Sidebar className="hidden sm:block sticky top-0" />
        <main className="flex-1 border-x border-border">{children}</main>
        {!pathname.includes(`messages`) && <SidebarRight />}
      </div>
      <MobileNav />
      <Toaster />
    </>
  );
};

export default Layout;
