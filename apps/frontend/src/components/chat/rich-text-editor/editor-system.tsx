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

export const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  codeExtension,
  linkExtension,
  blockFormatExtension,
] as const;

export const { Provider, useEditor } = createEditorSystem<typeof extensions>();
