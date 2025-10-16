import React from "react";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";

export const WorkspaceHeader: React.FC = () => {
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
        <Input placeholder="Search" className="h-8 text-xs" />
      </div>
    </SidebarHeader>
  );
};
