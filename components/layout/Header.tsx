"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <>
      <header className="z-50 sticky top-0 backdrop-blur-xl">
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
    </>
  );
};

export default Header;
