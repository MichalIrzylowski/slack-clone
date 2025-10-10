import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router";

export const UserPresence: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/40">
      <Avatar className="size-6">
        <AvatarFallback className="text-xs uppercase">
          {user?.name?.slice(0, 2) || "??"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="truncate text-xs font-medium">
          {user ? user.name : "Guest"}
        </span>
        <span className="truncate text-[10px] text-green-600 dark:text-green-500">
          ● {user ? "Online" : "Not Auth"}
        </span>
      </div>
      {user && (
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            aria-label="More"
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
