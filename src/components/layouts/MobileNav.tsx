"use client";
import { SIDEBAR_ITEMS } from "@/src/constants/path";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-t-border bg-background
    grid grid-cols-5 justify-items-center
    sm:hidden
    "
    >
      {SIDEBAR_ITEMS.slice(0, 5).map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx([`p-4`, pathname === item.href && `text-blue-500`])}
          >
            <Icon size={20} />
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
