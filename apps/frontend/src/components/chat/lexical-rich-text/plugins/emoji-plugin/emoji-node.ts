import {
  TextNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
} from "lexical";

export type SerializedEmojiNode = Spread<
  {
    unifiedId: string;
  },
  SerializedTextNode
>;

const BASE_EMOJI_URI = "/emoji/";

export class EmojiNode extends TextNode {
  __unifiedId: string;

  constructor(unifiedId: string, key?: NodeKey) {
    const unicodeEmoji = String.fromCodePoint(
      ...unifiedId.split("-").map((v) => parseInt(v, 16))
    );
    super(unicodeEmoji, key);

    this.__unifiedId = unifiedId.toLocaleLowerCase();
  }

  static getType() {
    return "emoji";
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.__unifiedId, node.__key);
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    return $createEmojiNode(serializedNode.unifiedId);
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      unifiedId: this.__unifiedId,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement("span");
    element.className =
      "text-transparent h-4 w-4 inline-block bg-contain bg-center bg-no-repeat align-middle";

    element.style.backgroundImage = `url(${BASE_EMOJI_URI}${this.__unifiedId}.png)`;

    element.textContent = this.__text;

    return element;
  }
}

export function $createEmojiNode(unifiedId: string): EmojiNode {
  return new EmojiNode(unifiedId).setMode("token");
}
