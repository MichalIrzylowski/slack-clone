import { useGetMessages } from "@/api/messages";
import { Message } from "../message/message";

export function MessageWrapper() {
  const messages = useGetMessages();
  if (messages.isLoading) {
    return <div>Loading messages...</div>;
  }
  if (messages.isError) {
    return <div>Error loading messages.</div>;
  }
  if (!messages.data) {
    return <div>No messages found.</div>;
  }

  return (
    <div>
      {messages.data.data.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </div>
  );
}
