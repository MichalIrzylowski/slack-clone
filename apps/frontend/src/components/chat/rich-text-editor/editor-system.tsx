import {
  blockFormatExtension,
  boldExtension,
  codeExtension,
  createEditorSystem,
  italicExtension,
  linkExtension,
  strikethroughExtension,
  underlineExtension,
} from "@lexkit/editor";
import { MentionExtension } from "./extensions/mention-extension";

export const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  codeExtension,
  linkExtension,
  blockFormatExtension,
  MentionExtension,
] as const;

export const { Provider, useEditor } = createEditorSystem<typeof extensions>();
