import MessageForm from "@/src/components/form/MessageForm";
import MessageHeader from "@/src/components/layouts/MessageHeader";
import MessageSidebar from "@/src/components/layouts/MessageSidebar";
import MessageCard from "@/src/components/MessageCard";
import { MOCK_MESSAGES } from "@/src/data";

const MessagesPage = () => {
  return (
    <div className="flex items-start">
      <MessageSidebar />
      <div className="flex-1 flex flex-col h-screen">
        <MessageHeader />
        <ul className="p-4 flex-1 overflow-y-auto scrollbar-beauty">
          {MOCK_MESSAGES.map((msg) => (
            <li key={msg.id}>
              <MessageCard message={msg} />
            </li>
          ))}
        </ul>
        <MessageForm />
      </div>
    </div>
  );
};

export default MessagesPage;
