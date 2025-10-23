import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { SerializedEditor } from "lexical";
import { Send } from "lucide-react";
import type { ReactNode } from "react";

export interface SubmitProps {
  onSubmit: (value: SerializedEditor) => void;
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
        <Button size="icon" onClick={() => onSubmit(editor.toJSON())}>
          <Send />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
