import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from "lexical";

export type SerializedMentionNode = Spread<
  {
    id: string;
    mentionName: string;
  },
  SerializedTextNode
>;

function $convertMentionElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const mentionName = domNode.getAttribute("data-lexical-mention-name");

  if (textContent !== null) {
    const node = $createMentionNode(
      typeof mentionName === "string" ? mentionName : textContent,
      textContent
    );
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "background-color: rgba(24, 119, 232, 0.2)";
export class MentionNode extends TextNode {
  __id: string;
  __mention: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__id, node.__mention, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    return $createMentionNode(
      serializedNode.id,
      serializedNode.mentionName
    ).updateFromJSON(serializedNode);
  }

  constructor(id: string, mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);

    this.__id = id;
    this.__mention = mentionName;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      id: this.__id,
      mentionName: this.__mention,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);

    dom.style.cssText = mentionStyle;
    dom.className = "mention";
    dom.spellcheck = false;

    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-mention", "true");
    if (this.__text !== this.__mention) {
      element.setAttribute("data-lexical-mention-name", this.__mention);
    }
    element.setAttribute("data-lexical-mention-person-id", this.__id);
    element.id = this.__id;
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null;
        }
        return {
          conversion: $convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  id: string,
  mentionName: string
): MentionNode {
  const mentionNode = new MentionNode(id, mentionName);
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}
