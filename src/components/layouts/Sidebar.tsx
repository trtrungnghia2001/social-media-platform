"use client";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { SIDEBAR_ITEMS } from "@/src/constants/path";
import { useSocket } from "@/src/contexts/useSocket";
import { useTheme } from "@/src/contexts/useTheme";
import { useAuthStore } from "@/src/stores/auth.store";
import { useClerk } from "@clerk/nextjs";
import clsx from "clsx";
import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useMemo } from "react";

export default function Sidebar({
  className,
  ...props
}: ComponentProps<"aside">) {
  const pathname = usePathname();
  const { notifications } = useSocket();
  const { auth, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useClerk();

  const renderItems = useMemo(() => {
    return SIDEBAR_ITEMS.map((item) =>
      auth ? { ...item, show: true } : item
    ).filter((item) => item.show);
  }, [auth]);

  const socketPathnameMatch = [`/notifications`, `/messages`];

  return (
    <aside
      className={clsx([`h-screen w-3xs p-4 bg-background`, className])}
      {...props}
    >
      <div className="h-full flex flex-col gap-6">
        <Link href={`/`} className="font-bold text-xl">
          Social
        </Link>
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-beauty">
          {renderItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  `flex items-center gap-4 rounded-full px-4 py-2 transition hover:bg-secondary-bg`,
                  ((pathname.includes(item.href) && item.href !== `/`) ||
                    (pathname === `/` && item.href === `/`)) &&
                    `font-semibold bg-secondary-bg`
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
                {socketPathnameMatch.includes(item.href) &&
                  item.href === "/notifications" &&
                  notifications > 0 && (
                    <span className="bg-red-500 text-white rounded-full text-xs w-5 aspect-square flex items-center justify-center leading-none">
                      {notifications}
                    </span>
                  )}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            className={clsx(
              `flex items-center gap-4 rounded-full px-4 py-2 transition hover:bg-secondary-bg`
            )}
          >
            {theme === "light" ? (
              <>
                <Moon className="size-5" />
                <span>Dark mode</span>
              </>
            ) : (
              <>
                <Sun className="size-5" />
                <span>Light mode</span>
              </>
            )}
          </button>
          {auth ? (
            <button
              onClick={async () => {
                await signOut();
                logout();
              }}
              className={`flex items-center gap-4 rounded-full px-4 py-2 transition hover:bg-secondary-bg`}
            >
              <LogOut className="size-5" />
              <span>Sign out</span>
            </button>
          ) : (
            <Link
              href={`/sign-in`}
              className={`flex items-center gap-4 rounded-full px-4 py-2 transition hover:bg-secondary-bg`}
            >
              <LogIn className="size-5" />
              <span>Signin</span>
            </Link>
          )}
        </div>

        {auth && (
          <div className="flex items-center gap-2">
            <Image
              src={auth.avatarUrl || IMAGES_DEFAULT.AVATAR}
              alt="avatar"
              loading="lazy"
              width={40}
              height={40}
              className="rounded-full object-center object-cover overflow-hidden aspect-square"
            />
            <div>
              <h4 className="font-bold">{auth.name}</h4>
              <p className="text-secondary">@{auth.username}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
