import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TextNode } from "lexical";
import { useEffect } from "react";
import findEmoji from "./find-emoji";
import { $createEmojiNode } from "../../../nodes/emoji-node";

function $updateTextNodeWithEmoji(node: TextNode) {
  if (!node.isSimpleText() || node.hasFormat("code")) {
    return;
  }

  const text = node.getTextContent();

  const emojiMatch = findEmoji(text);
  if (emojiMatch === null) {
    return;
  }

  let targetNode;

  const start = emojiMatch.position;
  const end = start + emojiMatch.shortcode.length;

  if (emojiMatch.position === 0) {
    [targetNode] = node.splitText(start, end);
  } else {
    [, targetNode] = node.splitText(start, end);
  }

  const emojiNode = $createEmojiNode(emojiMatch.unifiedId);

  targetNode.replace(emojiNode);
}

export function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, $updateTextNodeWithEmoji);
  }, [editor]);

  return null;
}
