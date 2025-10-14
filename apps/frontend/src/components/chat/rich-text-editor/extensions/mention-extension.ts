import { createExtension } from "@lexkit/editor";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from "lexical";

type MentionType = "user" | "channel";

type MentionTrigger = "@" | "#";

interface Suggestion {
  id: string;
  label: string;
  type: MentionType;
}

export const MentionExtension = createExtension({
  name: "mention",
  commands: (editor) => ({
    insertMention: (suggestion: Suggestion) => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.insertText(suggestion.label);
        }
      });
    },
  }),
  initialize(editor) {
    console.log("✅ Mention extension initialized");
    const unregisterKeyDown = editor.registerCommand<KeyboardEvent>(
      KEY_DOWN_COMMAND,
      (event) => {
        const key = event.key;

        if (key === "@" || key === "#") {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchor = selection.anchor;
            const node = anchor.getNode();
            const offset = anchor.offset;
            const textBefore = node.getTextContent().slice(0, offset);

            console.log(`🚀 Mention triggered by "${key}"`);
            console.log("📄 Text before cursor:", textBefore);

            // TODO: emit/show mention suggestions UI here
            // showMentionSuggestions({ trigger: key, position: anchor });
          });
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return unregisterKeyDown;
  },
});
