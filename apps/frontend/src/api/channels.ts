import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import type { ChannelResponseDto, CreateChannelDto } from "./__generated__/Api";

export const useGetChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await api.channels.channelControllerList();

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error("No data received");
      }

      return response.data;
    },
  });
};

export const useGetMyChannels = () => {
  return useQuery({
    queryKey: ["my-channels"],
    queryFn: async () => {
      const response = await api.channels.channelControllerMyChannels();

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error("No data received");
      }

      return response.data;
    },
  });
};

export const usePostChannel = () => {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-channel"],
    mutationFn: (channel: CreateChannelDto) =>
      api.channels.channelControllerCreate(channel),
    onSuccess: (newChannel) => {
      qc.setQueryData(["channels"], (oldData: ChannelResponseDto[]) => {
        return [...oldData, newChannel.data];
      });
    },
  });

  return mutation;
};
