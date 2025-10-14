import { ToggleWithTooltip } from "@/components/ui/toggle-with-tooltip";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { Bold } from "lucide-react";

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-x-1">
      <ToggleWithTooltip
        toggleProps={{
          children: <Bold />,
          onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
        }}
        tooltipContent="Bold"
      />
    </div>
  );
};
