import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import { useParams } from "react-router";

export async function fetchMessages(channelId: string) {
  try {
    return await api.messages.messageControllerGetMessages({ channelId });
  } catch {
    throw new Error("Failed to fetch messages");
  }
}

export const useGetMessages = () => {
  const { channelId } = useParams();
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => fetchMessages(channelId ?? ""),
  });
};
