import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, LogOutIcon } from "lucide-react";
import { UserCreateSheet } from "./user-create-sheet";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface UserMenuProps {
  userRole: string;
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ userRole, onLogout }) => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  const goToSettings = () => navigate("/settings");
  const openAddUserSheet = () => setCreateOpen(true);

  return (
    <div className="ml-auto flex items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="size-6"
        aria-label="Logout"
        onClick={onLogout}
      >
        <LogOutIcon className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            aria-label="More options"
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="min-w-40">
          <DropdownMenuItem onClick={goToSettings} className="text-xs">
            User Settings
          </DropdownMenuItem>
          {userRole === "ADMIN" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openAddUserSheet} className="text-xs">
                Add New User
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {userRole === "ADMIN" && (
        <UserCreateSheet
          hideTrigger
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
};
