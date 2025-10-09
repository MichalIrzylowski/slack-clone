import React, { useEffect, useState } from "react";
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

interface Channel {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ChannelSection: React.FC<{ currentChannelId: string }> = ({
  currentChannelId,
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    const fetchChannels = async () => {
      try {
        setLoading(true);
        setError(null);
        const base = import.meta.env.VITE_BACKEND_URL;
        if (!base) {
          throw new Error("VITE_BACKEND_URL is not defined");
        }
        const response = await fetch(`${base}/channels`, {
          signal: abort.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        const data: Channel[] = await response.json();
        setChannels(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching channels:", err);
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
    return () => abort.abort();
  }, []);

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
          {loading && (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span className="text-muted-foreground">
                  Loading channels...
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {!loading && error && (
            <SidebarMenuItem>
              <SidebarMenuButton variant="outline">
                <span className="text-destructive">Failed: {error}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {!loading &&
            !error &&
            channels.map((channels) => (
              <SidebarMenuItem key={channels.id}>
                <SidebarMenuButton isActive={channels.id === currentChannelId}>
                  <HashIcon className="text-muted-foreground" />
                  <span>#{channels.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
