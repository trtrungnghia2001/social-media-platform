"use client";
import { useSocketContext } from "@/contexts/SocketContext";
import clsx from "clsx";
import {
  Bell,
  House,
  LayoutDashboard,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import SidebarLeft from "./SidebarLeft";

const MobileNav = () => {
  const pathname = usePathname();
  const { counts } = useSocketContext();
  const tabs = useMemo(() => {
    return [
      {
        icon: House,
        path: `/`,
      },
      {
        icon: Bell,
        path: `/notifications`,
        count: counts.unreadNotifications,
      },
      {
        icon: Search,
        path: `/explore`,
      },
      {
        icon: MessageCircle,
        path: `/messages`,
        count: counts.unreadMessages,
      },
      {
        icon: LayoutDashboard,
        button: true,
      },
    ];
  }, [counts]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-t-border">
        <ul className="flex items-center justify-between gap-4 p-4">
          {tabs.map((tab, idx) => (
            <li key={idx}>
              {tab.button ? (
                <button
                  className={clsx([`block w-full relative text-secondary`])}
                  onClick={() => setOpen(true)}
                >
                  <tab.icon />
                </button>
              ) : (
                <Link
                  href={tab.path || ""}
                  className={clsx([
                    `block w-full relative`,
                    pathname === tab.path ? `text-inherit` : `text-secondary`,
                  ])}
                >
                  <tab.icon />
                  <span
                    className={clsx([
                      `absolute -right-1 -top-1 w-4 overflow-hidden aspect-square p-0.5 text-xs rounded-full bg-blue-500 text-white flex items-center justify-center`,
                      tab.count && tab.count > 0 ? "block" : "hidden",
                    ])}
                  >
                    {tab.count}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={clsx(
          `z-100 fixed inset-0 transform duration-300`,
          open ? `translate-x-0` : `-translate-x-full`
        )}
      >
        <div
          className="absolute -z-10 bg-black/50 inset-0"
          onClick={() => setOpen(!open)}
        ></div>
        <SidebarLeft onCloseSidebar={() => setOpen(false)} />
      </div>
    </>
  );
};

export default memo(MobileNav);
