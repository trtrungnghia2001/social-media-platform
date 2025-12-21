"use client";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { SIDEBAR_ITEMS } from "@/src/constants/path";
import { useTheme } from "@/src/contexts/useTheme";
import { useAuthStore } from "@/src/stores/auth.store";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { auth } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  return (
    <aside className="sticky top-0 h-screen w-3xs p-4 hidden sm:flex flex-col gap-6">
      <Link href={`/`} className="font-bold text-xl">
        Social
      </Link>
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-beauty">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                `flex items-center gap-4 rounded-full px-4 py-2 transition hover:bg-secondary-bg`,
                pathname === item.href && `font-semibold bg-secondary-bg`
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
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
        <button className="btn w-full text-15 font-semibold">Post</button>
      </div>

      {auth && (
        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square relative rounded-full overflow-hidden">
            <Image
              src={auth.avatarUrl || IMAGES_DEFAULT.AVATAR}
              alt="avatar"
              fill
            />
          </div>
          <div>
            <h4 className="font-bold">{auth.name}</h4>
            <p className="text-secondary">@{auth.username}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
