import React, { memo } from "react";
import SearchBox from "./SearchBox";
import Trending from "./Trending";
import WhoToFollow from "./WhoToFollow";

const SidebarRight = () => {
  return (
    <aside className="hidden ml-8 lg:block w-xs space-y-4 py-4">
      <SearchBox />
      <Trending />
      <WhoToFollow />
    </aside>
  );
};

export default memo(SidebarRight);
