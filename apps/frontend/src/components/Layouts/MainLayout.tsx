import React from "react";
import { Outlet } from "react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceHeader } from "./MainLayout/WorkspaceHeader";
import { ChannelSection } from "./MainLayout/ChannelSection";
import { DMSection } from "./MainLayout/DMSection";
import { UserPresence } from "./MainLayout/UserPresence";
import { TopBar } from "./MainLayout/TopBar";

type MainLayoutProps = { currentChannelId?: string };

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentChannelId = "gen",
}) => {
  return (
    <SidebarProvider className="bg-background text-foreground">
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <WorkspaceHeader />
        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 pb-4">
              <ChannelSection currentChannelId={currentChannelId} />
              <DMSection />
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <UserPresence />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <TopBar />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-auto">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
