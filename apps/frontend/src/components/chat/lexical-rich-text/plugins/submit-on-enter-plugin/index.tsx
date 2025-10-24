import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_HIGH,
  $getRoot,
  $createParagraphNode,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

type Props = {
  onSubmit: (value: {
    serialized: string;
    plainText: string;
    html: string;
  }) => void;
};

export const SubmitOnEnterPlugin = ({ onSubmit }: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        if (event.ctrlKey || event.metaKey) {
          // Allow normal newline when Ctrl/Cmd+Enter
          return false;
        }
        // Prevent newline and submit instead
        event.preventDefault();
        const editorState = editor.getEditorState();
        const serialized = JSON.stringify(editorState.toJSON());
        let plainText = "";
        let html = "";
        editorState.read(() => {
          plainText = $getRoot().getTextContent();
          html = $generateHtmlFromNodes(editor);
        });
        onSubmit({ serialized, plainText, html });
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        });
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, onSubmit]);

  return null;
};
