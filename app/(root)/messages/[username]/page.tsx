import MessageForm from "@/components/form/MessageForm";
import MessageHeader from "@/components/layout/MessageHeader";
import MessageList from "@/components/MessageList";
import { getUserByUsername } from "@/lib/actions";
import { notFound } from "next/navigation";

const PageDetailPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) return notFound();

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <MessageHeader user={user} />
      <MessageList />
      <MessageForm />
    </div>
  );
};

export default PageDetailPage;
