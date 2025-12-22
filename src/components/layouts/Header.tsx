"use client";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { useAuthStore } from "@/src/stores/auth.store";
import { Grip } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import FeedHeader from "../FeedHeader";
import Sidebar from "./Sidebar";
import clsx from "clsx";

const Header = () => {
  const { auth } = useAuthStore();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <>
      <div
        className={`sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <header className="sm:hidden p-4 relative flex items-center justify-between">
          <Image
            loading="lazy"
            src={auth?.avatarUrl || IMAGES_DEFAULT.AVATAR}
            alt="avatar"
            width={28}
            height={28}
            className="rounded-full object-cover aspect-square"
          />
          <h3 className="font-bold text-xl text-center">Social</h3>
          <button
            className="hover:opacity-70 transition"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <Grip />
          </button>
        </header>
        <FeedHeader />
      </div>
      <div
        className={clsx([
          `z-50 fixed inset-0 top-0 left-0 bottom-0 right-0 bg-black/50`,
          openSidebar ? `block ` : `hidden`,
        ])}
      >
        <Sidebar />
      </div>
    </>
  );
};

export default memo(Header);
