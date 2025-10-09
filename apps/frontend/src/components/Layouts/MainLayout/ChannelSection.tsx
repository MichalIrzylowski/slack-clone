import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon, HashIcon } from "lucide-react";
import { channels } from "./data";

export const ChannelSection: React.FC<{ currentChannelId: string }> = ({
  currentChannelId,
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between pr-0">
        <span className="uppercase tracking-wide">Channels</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          aria-label="Add channel"
        >
          <PlusIcon className="size-4" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((c) => (
            <SidebarMenuItem key={c.id}>
              <SidebarMenuButton isActive={c.id === currentChannelId}>
                <HashIcon className="text-muted-foreground" />
                <span>#{c.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
