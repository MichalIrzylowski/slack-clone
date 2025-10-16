import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { CONFIG } from "./config";
import { Toolbar } from "./toolbar";
import { EmojiPlugin } from "./plugins/emoji-plugin";

export const LexicalRichText = () => {
  return (
    <LexicalComposer initialConfig={CONFIG}>
      <div className="bg-gray-100/50 p-2 rounded-md border border-gray-300">
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
      </div>
    </LexicalComposer>
  );
};
