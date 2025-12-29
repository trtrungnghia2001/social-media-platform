"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  Home,
  Search,
  Bell,
  User,
  Users,
  Ellipsis,
  LucideIcon,
  Sun,
  Moon,
  LogOut,
  MessageCircle,
  Brain,
  LogIn,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { useThemeContext } from "@/contexts/ThemeContext";
import { ComponentProps } from "react";

export type NavItemType = {
  title: string;
  path: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
};

export const navItems: NavItemType[] = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: Search,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Bell,
    requiresAuth: true,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: MessageCircle,
    requiresAuth: true,
  },
  {
    title: "Grok",
    path: "/grok",
    icon: Brain,
  },
  {
    title: "Communities",
    path: "/communities",
    icon: Users,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: User,
    requiresAuth: true,
  },
  {
    title: "More",
    path: "/more",
    icon: Ellipsis,
  },
];

const SidebarLeft = ({ className, ...props }: ComponentProps<"aside">) => {
  const { theme, toggleTheme } = useThemeContext();
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <aside
      className={clsx(
        `w-3xs h-screen bg-background sticky top-0 pt-4`,
        className
      )}
      {...props}
    >
      <div className="h-full flex flex-col gap-4">
        <Link href={`/`} className="font-bold text-lg px-4 block">
          Social
        </Link>
        <ul className="flex-1 overflow-y-auto scrollbar-beauty">
          {navItems.map((nav) => (
            <li key={nav.title}>
              <Link
                href={nav.path}
                className={clsx(
                  `flex items-center gap-2 px-4 py-2 transition-all rounded-full hover:bg-secondaryBg w-full`,
                  pathname === nav.path && `font-bold`
                )}
              >
                <nav.icon size={18} />
                <span>{nav.title}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 transition-all rounded-full hover:bg-secondaryBg w-full"
            >
              {theme === "dark" && (
                <>
                  <Sun size={18} />
                  Light mode
                </>
              )}
              {theme === "light" && (
                <>
                  <Moon size={18} />
                  Dark mode
                </>
              )}
            </button>
          </li>
          <li>
            {isSignedIn && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-full hover:bg-secondaryBg w-full"
              >
                <LogOut size={18} />
                Sign out
              </button>
            )}
            {!isSignedIn && (
              <Link
                href={`/sign-in`}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-full hover:bg-secondaryBg w-full"
              >
                <LogIn size={18} />
                Sign in
              </Link>
            )}
          </li>
        </ul>
        {user && (
          <div className="flex items-center gap-4 p-4">
            <Image
              alt="avatar"
              src={user?.imageUrl || IMAGE_DEFAULT.AVATAR}
              width={40}
              height={40}
              unoptimized
              loading="lazy"
              className="img rounded-full overflow-hidden"
            />
            <div>
              <h3 className="font-bold leading-none">{user?.fullName}</h3>
              <p className="text-13 text-secondary">@{user?.username}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarLeft;
