import MessageForm from "@/src/components/form/MessageForm";
import MessageHeader from "@/src/components/layouts/MessageHeader";
import MessageCard from "@/src/components/MessageCard";
import { MOCK_MESSAGES } from "@/src/data";

const MessagesUserPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
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
  );
};

export default MessagesUserPage;
