import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useEditor } from "./editor-system";

export const SubmitButton = () => {
  const editor = useEditor();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        const result = editor.export.toJSON();
        console.log(result);
      }}
    >
      <Send />
    </Button>
  );
};
