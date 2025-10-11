import { useCallback, useState } from "react";
import { useEditor } from "./editor-system";
import {
  Bold,
  Code,
  FileText,
  Hash,
  Italic,
  LinkIcon,
  Quote,
  Strikethrough,
  Underline,
  Unlink,
} from "lucide-react";
import { ToggleWithTooltip } from "@/components/ui/toggle-with-tooltip";
import { Separator } from "@/components/ui/separator";
import { InsertLinkDialog } from "./insert-link-dialog";
import { BlockFormatSelect } from "./block-format-select";

const blockFormatOptions = [
  { value: "p", label: "Paragraph", icon: <FileText className="h-4 w-4" /> },
  { value: "h1", label: "Heading 1", icon: <Hash className="h-4 w-4" /> },
  { value: "h2", label: "Heading 2", icon: <Hash className="h-4 w-4" /> },
  { value: "h3", label: "Heading 3", icon: <Hash className="h-4 w-4" /> },
  { value: "quote", label: "Quote", icon: <Quote className="h-4 w-4" /> },
];

export const Toolbar = () => {
  const { commands, activeStates } = useEditor();
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const currentBlockFormat = activeStates.isH1
    ? "h1"
    : activeStates.isH2
      ? "h2"
      : activeStates.isH3
        ? "h3"
        : activeStates.isQuote
          ? "quote"
          : "p";

  const handleBlockFormatChange = useCallback(
    (value: string) => {
      if (value === "p") commands.toggleParagraph();
      else if (value.startsWith("h"))
        commands.toggleHeading(value as "h1" | "h2" | "h3");
      else if (value === "quote") commands.toggleQuote();
    },
    [commands]
  );

  return (
    <div className="flex space-x-1 items-center">
      <ToggleWithTooltip
        toggleProps={{
          onPressedChange: () => commands.toggleBold(),
          children: <Bold />,
          pressed: activeStates.bold,
        }}
        tooltipContent="Bold"
      />
      <ToggleWithTooltip
        toggleProps={{
          onPressedChange: () => commands.toggleItalic(),
          children: <Italic />,
          pressed: activeStates.italic,
        }}
        tooltipContent="Italic"
      />
      <ToggleWithTooltip
        toggleProps={{
          onPressedChange: () => commands.toggleUnderline(),
          children: <Underline />,
          pressed: activeStates.underline,
        }}
        tooltipContent="Underline"
      />
      <ToggleWithTooltip
        toggleProps={{
          onPressedChange: () => commands.toggleStrikethrough(),
          children: <Strikethrough />,
          pressed: activeStates.strikethrough,
        }}
        tooltipContent="Strikethrough"
      />
      <Separator orientation="vertical" className="!h-6" />
      <ToggleWithTooltip
        toggleProps={{
          onPressedChange: () => commands.toggleCodeBlock(),
          children: <Code />,
          pressed: activeStates.isInCodeBlock,
        }}
        tooltipContent="Inline Code"
      />
      <ToggleWithTooltip
        toggleProps={{
          disabled: !activeStates.isTextSelected && !activeStates.isLink,
          pressed: activeStates.isLink,
          children: activeStates.isLink ? <Unlink /> : <LinkIcon />,
          onPressedChange: () => {
            if (activeStates.isLink) {
              commands.removeLink();
            } else if (activeStates.isTextSelected) {
              setIsLinkDialogOpen(true);
            }
          },
        }}
        tooltipContent={activeStates.isLink ? "Remove Link" : "Add Link"}
      />
      <Separator orientation="vertical" className="!h-6" />
      <BlockFormatSelect
        value={currentBlockFormat}
        options={blockFormatOptions}
        onChange={handleBlockFormatChange}
      />
      <InsertLinkDialog
        isOpen={isLinkDialogOpen}
        onOpenChange={() => setIsLinkDialogOpen(false)}
        onSubmit={(data) => {
          commands.insertLink(data.url);
          setIsLinkDialogOpen(false);
        }}
      />
    </div>
  );
};
