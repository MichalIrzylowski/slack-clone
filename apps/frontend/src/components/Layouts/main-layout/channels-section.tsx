import React, { useEffect, useState } from "react";
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

interface Channel {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ChannelSection: React.FC<{ currentChannelId?: string }> = ({
  currentChannelId,
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { channelId: routeChannelId } = useParams();
  const activeChannelId = currentChannelId || routeChannelId;

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
        const raw = await response.json();
        // Support both legacy array response and new paginated {items,nextCursor}
        const data: Channel[] = Array.isArray(raw) ? raw : raw.items;
        setChannels(data || []);
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

  const appendChannel = (ch: Channel) => {
    setChannels((prev) => [...prev, ch]);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between pr-0">
        <span className="uppercase tracking-wide">Channels</span>
        <ChannelCreateSheet onCreated={appendChannel} />
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
            channels.map((channel) => (
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
  );
};
