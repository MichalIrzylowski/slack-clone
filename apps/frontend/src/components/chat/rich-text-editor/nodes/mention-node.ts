import { TextNode } from "lexical";

export class MentionNode extends TextNode {
  __id: string;
  __type: "user" | "channel";

  static getType() {
    return "mention";
  }

  static clone(node: MentionNode) {
    return new MentionNode(node.__id, node.__type, node.__text, node.__key);
  }

  constructor(
    id: string,
    type: "user" | "channel",
    text: string,
    key?: string
  ) {
    super(text, key);
    this.__id = id;
    this.__type = type;
  }

  createDOM() {
    const button = document.createElement("button");
    button.className = "mention px-1 rounded bg-blue-100 text-blue-800";
    button.textContent = (this.__type === "user" ? "@" : "#") + this.__text;
    button.setAttribute("type", "button");
    return button;
  }
}
