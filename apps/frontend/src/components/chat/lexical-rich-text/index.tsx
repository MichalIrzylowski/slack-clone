import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CONFIG } from "./config";
import { Toolbar } from "./toolbar";
import { EmojiPlugin } from "./plugins/emoji-plugin";
import { MentionsPlugin } from "./plugins/mentions-plugin";
import { useRef } from "react";
import { useGetUsers } from "@/api/users";
import { Submit } from "./submit";

export const LexicalRichText = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const users = useGetUsers();

  return (
    <LexicalComposer initialConfig={CONFIG}>
      <div
        ref={wrapperRef}
        className="bg-gray-100/50 p-2 rounded-md border border-gray-300"
      >
        <Toolbar />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder="Write here"
                placeholder={
                  <div className="absolute top-2 left-2 pointer-events-none opacity-50">
                    Write here...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <EmojiPlugin />
        {users.data && (
          <MentionsPlugin wrapperRef={wrapperRef} options={users.data.items} />
        )}
      </div>
      <Submit />
    </LexicalComposer>
  );
};
