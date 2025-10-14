import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import { TreeViewPlugin } from "./plugins/tree-view-plugin";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { theme } from "./theme";
import { HeadingNode } from "@lexical/rich-text";

const onError = (error: Error) => {
  console.error(error);
};

const initialConfig: InitialConfigType = {
  namespace: "my-editor",
  theme,
  onError,
  nodes: [HeadingNode],
};

export const LexicalRichTextEditor = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <div className="relative">
            <ContentEditable
              aria-placeholder="Enter some text..."
              placeholder={
                <div className="absolute top-2 left-2 opacity-50 pointer-events-none">
                  📝 start writing here
                </div>
              }
              className="h-50 p-2 border rounded-md"
            />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      {/* <TreeViewPlugin /> */}
    </LexicalComposer>
  );
};
