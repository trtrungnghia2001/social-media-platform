"use client";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const LayoutRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isHiddenSidebarRight = useMemo(() => {
    const pathnames = [`/messages`];

    return pathnames.some((p) => pathname.includes(p));
  }, [pathname]);

  return (
    <div className="flex items-start gap-6 max-w-7xl w-full mx-auto">
      <SidebarLeft className="hidden sm:block" />
      <main className="flex-1 border-x border-border min-h-screen">
        {children}
      </main>
      {!isHiddenSidebarRight && <SidebarRight />}
    </div>
  );
};

export default LayoutRoot;
