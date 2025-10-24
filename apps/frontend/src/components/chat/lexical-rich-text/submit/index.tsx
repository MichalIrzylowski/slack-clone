import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getRoot } from "lexical";
import { Send } from "lucide-react";
import type { ReactNode } from "react";

export interface SubmitProps {
  onSubmit: (value: {
    serialized: string;
    plainText: string;
    html: string;
  }) => void;
  tooltipContent?: ReactNode;
}

export function Submit({
  onSubmit,
  tooltipContent = "Send message",
}: SubmitProps) {
  const [editor] = useLexicalComposerContext();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          onClick={() => {
            const editorState = editor.getEditorState();
            const serialized = JSON.stringify(editorState.toJSON());
            let plainText = "";
            let html = "";
            editorState.read(() => {
              plainText = $getRoot().getTextContent();
              html = $generateHtmlFromNodes(editor);
            });
            onSubmit({ serialized, plainText, html });
            editor.update(() => {
              const root = $getRoot();
              root.clear();
              root.append($createParagraphNode());
            });
            onSubmit({ serialized, plainText, html });
          }}
        >
          <Send />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
