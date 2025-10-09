import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";

export const UserPresence: React.FC = () => {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/40">
      <Avatar className="size-6">
        <AvatarFallback className="text-xs">ME</AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="truncate text-xs font-medium">You</span>
        <span className="truncate text-[10px] text-green-600 dark:text-green-500">
          ● Online
        </span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          aria-label="More"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
