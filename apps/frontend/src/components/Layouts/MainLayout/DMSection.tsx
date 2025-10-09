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
import { UserPlusIcon } from "lucide-react";
import { dms } from "./data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const DMSection: React.FC = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between pr-0">
        <span className="uppercase tracking-wide">Direct Messages</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          aria-label="New DM"
        >
          <UserPlusIcon className="size-4" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {dms.map((u) => (
            <SidebarMenuItem key={u.id}>
              <SidebarMenuButton>
                <Avatar className="size-5">
                  <AvatarFallback className="text-[10px]">
                    {u.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span>{u.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
