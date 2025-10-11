import { Editor } from "./editor";
import { extensions, Provider } from "./editor-system";
import { theme } from "./theme";

export const RichTextEditor = () => {
  return (
    <Provider extensions={extensions} config={{ theme }}>
      <Editor />
    </Provider>
  );
};
