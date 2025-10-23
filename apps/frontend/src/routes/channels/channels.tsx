import { LexicalRichText } from "@/components/chat/lexical-rich-text";
import { MessageWrapper } from "@/components/message-wrapper/message-wrapper";
import React from "react";

export const ChannelPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <MessageWrapper />
      <LexicalRichText />
    </div>
  );
};

export default ChannelPage;
