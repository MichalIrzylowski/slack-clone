import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HashIcon, SearchIcon } from "lucide-react";

export const TopBar: React.FC = () => {
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b px-2 md:px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="inline-flex md:hidden" />
        <div className="flex items-center gap-1 font-semibold text-sm">
          <HashIcon className="size-4 text-muted-foreground" />
          <span className="hidden sm:inline">general</span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <div className="relative hidden md:block">
          <Input placeholder="Search" className="h-8 w-56 pl-8 text-xs" />
          <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          aria-label="Search"
        >
          <SearchIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
