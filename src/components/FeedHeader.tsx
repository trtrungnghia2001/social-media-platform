"use client";
import { FEED_PATHS } from "@/src/constants/path";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { memo } from "react";

const FeedHeader = () => {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex">
        {FEED_PATHS.map((item) => (
          <button
            key={item.path}
            className={clsx(
              `relative flex-1 py-3 font-semibold hover:bg-secondary-bg`,
              pathname === item.path &&
                `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500`
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default memo(FeedHeader);
