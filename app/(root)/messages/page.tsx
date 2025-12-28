import { Bot } from "lucide-react";

const MessagesPage = () => {
  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <Bot size={48} className="text-blue-500 animate-bounce" />
      <h3>Welcome to the chat room, please select a chat room.</h3>
    </div>
  );
};

export default MessagesPage;
