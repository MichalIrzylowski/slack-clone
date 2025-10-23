import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_HIGH,
  $getRoot,
  $createParagraphNode,
  type SerializedEditor,
} from "lexical";

type Props = {
  onSubmit: (value: SerializedEditor) => void;
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
        onSubmit(editor.toJSON());
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
