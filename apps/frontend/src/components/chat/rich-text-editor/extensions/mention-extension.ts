import { createExtension } from "@lexkit/editor";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from "lexical";
import { MentionNode } from "../nodes/mention-node";

type MentionType = "user" | "channel";

type MentionTrigger = "@" | "#";

interface Suggestion {
  id: string;
  label: string;
  type: MentionType;
}

export interface MentionEventDetail {
  trigger: MentionTrigger;
  query: string;
  anchorRect: DOMRect | null;
}

const isMentionKey = (char: string): char is MentionTrigger => {
  return char === "@" || char === "#";
};

const isForbiddenKey = (char: string) => {
  return [" ", "Enter", "Escape"].includes(char);
};

// Shared state for mention tracking
let activeTrigger: MentionTrigger | null = null;
let triggerOffset: number | null = null;

export const MentionExtension = createExtension({
  name: "mention",
  nodes: [MentionNode],
  commands: (editor) => ({
    insertMention: (suggestion: Suggestion) => {
      console.log("🔧 insertMention called with:", suggestion, "triggerOffset:", triggerOffset);
      
      editor.update(() => {
        const selection = $getSelection();
        console.log("📍 Selection:", selection);
        
        if (!$isRangeSelection(selection)) {
          console.log("❌ No range selection");
          return;
        }

        // Get current position
        const anchor = selection.anchor;
        const currentOffset = anchor.offset;
        const node = anchor.getNode();
        
        console.log("📊 Current state:", {
          triggerOffset,
          currentOffset,
          nodeType: node.getType(),
          isTextNode: $isTextNode(node)
        });

        // Check if it's a text node
        if ($isTextNode(node)) {
          const textContent = node.getTextContent();
          console.log("📝 Text node content before:", `"${textContent}"`);
          
          // If we don't have a stored triggerOffset, try to find it dynamically
          let actualTriggerOffset = triggerOffset;
          if (actualTriggerOffset === null) {
            // Look for @ or # in the current text
            const beforeCursor = textContent.substring(0, currentOffset);
            const lastAtIndex = beforeCursor.lastIndexOf('@');
            const lastHashIndex = beforeCursor.lastIndexOf('#');
            actualTriggerOffset = Math.max(lastAtIndex, lastHashIndex);
            console.log("� Found trigger offset dynamically:", actualTriggerOffset);
          }
          
          if (actualTriggerOffset >= 0) {
            // Create the mention node
            const mentionNode = new MentionNode(
              suggestion.id,
              suggestion.type,
              suggestion.label
            );
            console.log("✨ Created mention node:", mentionNode);
            
            // Select the text from trigger to current cursor position
            selection.setTextNodeRange(node, actualTriggerOffset, node, currentOffset);
            console.log("🎯 Set selection range:", actualTriggerOffset, "to", currentOffset);

            // Replace selected text with mention node
            selection.insertNodes([mentionNode]);
            console.log("✅ Inserted mention node");

            // Reset trigger state
            activeTrigger = null;
            triggerOffset = null;
            console.log("🔄 Reset trigger state");
          } else {
            console.log("❌ Could not find trigger position");
          }
        } else {
          console.log("❌ Node is not a text node:", node.getType());
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

        if (isMentionKey(key)) {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchor = selection.anchor;

            activeTrigger = key;
            triggerOffset = anchor.offset;

            console.log(`🚀 Mention triggered: ${key}, offset: ${triggerOffset}`);
          });
        }

        if (isForbiddenKey(key)) {
          console.log(`🚫 Forbidden key pressed: ${key}, clearing trigger state`);
          // Only clear on Escape or if there's no active mention query
          if (key === "Escape") {
            activeTrigger = null;
            triggerOffset = null;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const unregisterUpdate = editor.registerUpdateListener(
      ({ editorState }) => {
        if (!activeTrigger || !triggerOffset) return;

        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const anchor = selection.anchor;
          const node = anchor.getNode();

          const text = node.getTextContent();
          const mentionText = text.slice(triggerOffset! + 1, anchor.offset);

          console.log({ triggerOffset });

          console.log(
            `🔎 Mention query for ${activeTrigger}: "${mentionText}"`
          );

          // TODO: wyemituj do UI (np. React setState)
          // showMentionSuggestions({
          //   trigger: activeTrigger,
          //   query: mentionText,
          //   position: anchor,
          // });

          const domSelection = window.getSelection();
          const range = domSelection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect() ?? null;

          const event = new CustomEvent<MentionEventDetail>("mention-query", {
            detail: {
              trigger: activeTrigger!,
              query: mentionText,
              anchorRect: rect,
            },
          });

          console.log("🚀 Event emit", {
            trigger: activeTrigger,
            mentionText,
            rect,
          });

          window.dispatchEvent(event);
        });
      }
    );

    return () => {
      unregisterKeyDown();
      unregisterUpdate();
    };
  },
});
