import { Search } from "lucide-react";
import { ComponentProps, memo } from "react";

const InputSearch = ({ ...props }: ComponentProps<"input">) => {
  return (
    <div>
      {/* input */}
      <div className="flex items-center border border-border rounded-full pl-3">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 w-full border-none outline-none p-1.5"
          {...props}
        />
      </div>
    </div>
  );
};

export default memo(InputSearch);
