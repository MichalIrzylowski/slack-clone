import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Send } from "lucide-react";

export function Submit() {
  const [editor] = useLexicalComposerContext();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          onClick={() => {
            console.log(editor.toJSON());
          }}
        >
          <Send />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Send message</TooltipContent>
    </Tooltip>
  );
}
