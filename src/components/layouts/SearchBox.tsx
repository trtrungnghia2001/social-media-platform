import { Search } from "lucide-react";
import React, { memo } from "react";

const SearchBox = () => {
  return (
    <div className="flex items-center rounded-full overflow-hidden bg-secondary-bg pl-4">
      <Search size={16} className="text-secondary" />
      <input
        type="text"
        className="bg-transparent border-none outline-none ring-offset-0 flex-1 p-2"
        placeholder="Search"
      />
    </div>
  );
};

export default memo(SearchBox);
