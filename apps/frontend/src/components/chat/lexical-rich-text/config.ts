import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { theme } from "./theme";
import { nodes } from "../nodes";

export const CONFIG: InitialConfigType = {
  namespace: "slack-clone-main-input",
  onError: (error) => {
    throw error;
  },
  theme,
  nodes,
};
