"use client";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import clsx from "clsx";
import { Grip } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarLeft from "./SidebarLeft";
import { useAuthContext } from "@/contexts/AuthContext";

const tabs = [
  {
    title: "For you",
    path: `/`,
  },
  {
    title: "Following",
    path: `/following`,
  },
];

const Header = () => {
  const { auth } = useAuthContext();

  const pathname = usePathname();
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
      <header className="z-50 sticky top-0 backdrop-blur-xl">
        <div className="md:hidden p-4 flex items-center justify-between">
          <div>
            {auth && (
              <Image
                alt="avatar"
                src={auth?.avatarUrl || IMAGE_DEFAULT.AVATAR}
                width={40}
                height={40}
                loading="lazy"
                unoptimized
                className="img rounded-full overflow-hidden"
              />
            )}
          </div>
          <Link href={`/`} className="font-bold text-lg px-4 block">
            Social
          </Link>
          <button onClick={() => setOpen(!open)}>
            <Grip />
          </button>
        </div>
        <div className="grid grid-cols-2">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={clsx(
                `p-4 block w-full font-bold text-center hover:bg-secondaryBg relative`,
                pathname === tab.path
                  ? `after:absolute after:left-0 after:right-0 after:bottom-0 after:bg-blue-500 after:h-0.5`
                  : `text-secondary`
              )}
            >
              {tab.title}
            </Link>
          ))}
        </div>
      </header>
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
        <SidebarLeft />
      </div>
    </>
  );
};

export default Header;
