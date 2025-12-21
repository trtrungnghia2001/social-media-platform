"use client";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { useAuthStore } from "@/src/stores/auth.store";
import { Grip } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import FeedHeader from "../FeedHeader";

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

  return (
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
        <button className="hover:opacity-70 transition">
          <Grip />
        </button>
      </header>
      <FeedHeader />
    </div>
  );
};

export default memo(Header);
