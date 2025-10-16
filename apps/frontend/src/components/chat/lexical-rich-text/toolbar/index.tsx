import { Toggle } from "@/components/ui/toggle";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { Bold, Italic } from "lucide-react";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const isBold = selection.hasFormat("bold");
      const isItalic = selection.hasFormat("italic");
      setIsBold(isBold);
      setIsItalic(isItalic);
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar();
      });
    });
  }, [editor, $updateToolbar]);

  return (
    <div className="flex border border-gray-300 rounded-md mb-2 flex-wrap">
      <Toggle
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        pressed={isBold}
      >
        <Bold />
      </Toggle>
      <Toggle
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        pressed={isItalic}
      >
        <Italic />
      </Toggle>
    </div>
  );
};
