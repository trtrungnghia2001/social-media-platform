"use client";
import Feed from "@/components/Feed";
import InputSearch from "@/components/form/InputSearch";
import UserCard from "@/components/UserCard";
import { mockUsers } from "@/helpers/mockdata";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import clsx from "clsx";
import Link from "next/link";

const tabs = [
  {
    label: "Top",
    path: ``,
  },
  {
    label: "Everybody",
    path: `everybody`,
  },
  {
    label: "Posts",
    path: `posts`,
  },
];

const ExplorePage = () => {
  const { searchParams, updateQuery } = useUpdateQuery();
  const f = searchParams.get("f") || "";

  return (
    <div className="py-4 space-y-2">
      <div className="px-4">
        <InputSearch />
      </div>
      {/* tabs */}
      <section>
        <ul className="grid grid-cols-3">
          {tabs.map((tab, idx) => (
            <li key={idx}>
              <button
                onClick={() => {
                  updateQuery("f", tab.path);
                }}
                className={clsx(
                  `relative p-3 font-bold w-full hover:bg-secondaryBg text-center block`,
                  f === tab.path
                    ? `after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-500`
                    : ` text-secondary`
                )}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {/* main */}
      {
        <section>
          {(f === "" || f === tabs[1].path) && (
            <ul>
              {mockUsers.map((u) => (
                <li key={u.id}>
                  <UserCard user={u} />
                </li>
              ))}
              <li>
                <Link
                  className="py-3 px-4 hover:bg-secondaryBg text-blue-500 block"
                  href={`/`}
                >
                  View all
                </Link>
              </li>
            </ul>
          )}
          {(f === "" || f === tabs[2].path) && <Feed />}
        </section>
      }
    </div>
  );
};

export default ExplorePage;
