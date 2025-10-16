import { useEffect, useState } from "react";
import { useEditor } from "./editor-system";
import type { MentionEventDetail } from "./extensions/mention-extension";

interface Suggestion {
  id: string;
  label: string;
}

export function MentionDropdown() {
  const { commands } = useEditor();
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMention = (e: CustomEvent<MentionEventDetail>) => {
      const { trigger, query, anchorRect } = e.detail;

      console.log(e.detail);
      if (!anchorRect) return;

      if (query.length === 0) {
        setVisible(false);
        return;
      }

      setQuery(query);
      setVisible(true);
      setPosition({
        x: anchorRect.left,
        y: anchorRect.bottom + 4,
      });
    };

    window.addEventListener("mention-query", handleMention as EventListener);

    return () => {
      window.removeEventListener(
        "mention-query",
        handleMention as EventListener
      );
    };
  }, []);

  if (!visible || !position) return null;

  const suggestions: Suggestion[] = [
    { id: "1", label: "Marcin" },
    { id: "2", label: "Marta" },
    { id: "3", label: "Mark" },
  ].filter((s) => s.label.toLowerCase().startsWith(query.toLowerCase()));

  console.log(suggestions);

  return (
    <div
      className="absolute bg-white shadow-md rounded-md border p-2"
      style={{
        left: position.x,
        top: position.y,
        minWidth: 120,
        zIndex: 1000,
      }}
    >
      {suggestions.map((s) => (
        <div
          key={s.id}
          className="cursor-pointer hover:bg-gray-100 px-2 py-1"
          onClick={() => {
            commands.insertMention({ id: s.id, label: s.label, type: "user" });
            setVisible(false);
          }}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}
