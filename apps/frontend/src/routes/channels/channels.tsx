import React from "react";
import { useParams } from "react-router";

export const ChannelPage: React.FC = () => {
  const { channelId } = useParams();
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">
        Channel: <span className="font-mono">#{channelId}</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        This is the start of the #{channelId} channel.
      </p>
    </div>
  );
};

export default ChannelPage;
