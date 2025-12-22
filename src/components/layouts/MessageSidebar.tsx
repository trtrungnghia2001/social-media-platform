import { MOCK_CONTACTS } from "@/src/data";
import { Search } from "lucide-react";
import ContactCard from "../ContactCard";
import { ComponentProps } from "react";
import clsx from "clsx";

const MessageSidebar = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={clsx([
        "w-full lg:w-2xs lg:border-r lg:border-r-border",
        className,
      ])}
      {...props}
    >
      <div className={`flex flex-col h-screen`}>
        {/* search */}
        <div className="p-4">
          <h3 className="mb-4 font-bold text-xl">Chat</h3>
          <div className="flex items-center bg-secondary-bg rounded-full overflow-hidden pl-3">
            <Search size={16} />
            <input
              type="text"
              className="flex-1 border-none outline-none bg-transparent p-1.5"
              placeholder="Search..."
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-beauty p-2 space-y-2">
          {MOCK_CONTACTS.map((contact) => (
            <li key={contact.id}>
              <ContactCard contact={contact} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessageSidebar;
