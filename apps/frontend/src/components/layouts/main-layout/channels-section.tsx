import React from "react";
import { Link, useParams } from "react-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HashIcon } from "lucide-react";
import { ChannelCreateSheet } from "./channel-create-sheet";
import { useGetMyChannels } from "@/api/channels";

export const ChannelSection: React.FC<{ currentChannelId?: string }> = ({
  currentChannelId,
}) => {
  const { channelId: routeChannelId } = useParams();
  const activeChannelId = currentChannelId || routeChannelId;
  const {
    data: myChannels,
    isLoading: isLoadingMy,
    error: errorMy,
  } = useGetMyChannels();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between pr-0">
          <span className="uppercase tracking-wide">My Channels</span>
          <ChannelCreateSheet />
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {isLoadingMy && (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span className="text-muted-foreground">Loading...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {!isLoadingMy && errorMy && (
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline">
                  <span className="text-destructive">
                    Failed: {String(errorMy.message)}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {!isLoadingMy && !errorMy && myChannels?.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span className="text-muted-foreground text-sm">
                    You haven't joined any channels yet.
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {!isLoadingMy &&
              !errorMy &&
              myChannels?.map((channel) => (
                <SidebarMenuItem key={channel.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={channel.id === activeChannelId}
                    tooltip={channel.name}
                  >
                    <Link
                      to={`/channels/${channel.id}`}
                      className="flex items-center gap-2"
                    >
                      <HashIcon className="text-muted-foreground" />
                      <span>#{channel.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
