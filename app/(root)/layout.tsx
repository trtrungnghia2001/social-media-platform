import MobileNav from "@/src/components/layouts/MobileNav";
import Sidebar from "@/src/components/layouts/Sidebar";
import SidebarRight from "@/src/components/layouts/SidebarRight";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="max-w-7xl w-full mx-auto flex items-start mb-16 sm:mb-0">
        <Sidebar />
        <main className="flex-1 lg:mr-8 border-x border-border">
          {children}
        </main>
        <SidebarRight />
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;
