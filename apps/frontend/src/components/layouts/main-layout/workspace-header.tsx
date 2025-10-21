import React from "react";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDownIcon } from "lucide-react";
import { Combobox } from "@/components/combobox";
import {
  useGetChannels,
  useGetMyChannels,
  useJoinChannel,
} from "@/api/channels";
import { useNavigate } from "react-router";

export const WorkspaceHeader: React.FC = () => {
  const channels = useGetChannels();
  const myChannels = useGetMyChannels();
  const joinMutation = useJoinChannel();
  const navigate = useNavigate();

  const handleSelect = (channelId: string) => {
    joinMutation.mutate(channelId, {
      onSuccess: () => {
        navigate(`/channels/${channelId}`);
      },
    });
  };
  return (
    <SidebarHeader>
      <div className="flex items-center gap-2 px-2">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Acme Corp</span>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <span>All workspaces</span>
            <ChevronDownIcon className="size-3" />
          </button>
        </div>
      </div>
      <div className="px-2 pt-1">
        <Combobox
          triggerChild={joinMutation.isPending ? "Joining..." : "Search"}
          options={channels.data
            ?.filter(
              (channel) => !myChannels.data?.some((c) => c.id === channel.id)
            )
            .map((channel) => ({
              value: channel.id,
              label: channel.name,
            }))}
          onSelect={handleSelect}
        />
      </div>
    </SidebarHeader>
  );
};
