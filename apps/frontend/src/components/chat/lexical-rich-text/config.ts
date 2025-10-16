import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { theme } from "./theme";
import { EmojiNode } from "./plugins/emoji-plugin/emoji-node";

export const CONFIG: InitialConfigType = {
  namespace: "slack-clone-main-input",
  onError: (error) => {
    throw error;
  },
  theme,

  nodes: [EmojiNode],
};
