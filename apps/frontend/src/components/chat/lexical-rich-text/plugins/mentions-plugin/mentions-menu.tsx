import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export interface MentionsMenuProps<
  O extends { id: string; name: string; key: string },
> {
  anchorEl: HTMLElement;
  wrapperEl: HTMLElement;
  query: string | null;
  selectedIndex: number | null;
  setHighlightedIndex: (i: number) => void;
  options: O[];
  onSelect: (option: O) => void;
}

export function MentionsMenu<
  O extends { id: string; name: string; key: string },
>({
  anchorEl,
  wrapperEl,
  query,
  selectedIndex,
  setHighlightedIndex,
  options,
  onSelect,
}: MentionsMenuProps<O>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  const recalculateStyles = useCallback(() => {
    const anchorRect = anchorEl.getBoundingClientRect();
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const menuRect = menuEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = anchorRect.left - wrapperRect.left;
    let top = anchorRect.bottom - wrapperRect.top;

    if (left < 0) left = 0;
    const maxLeft = Math.min(
      wrapperRect.width - menuRect.width,
      viewportW - menuRect.width - wrapperRect.left
    );
    if (left > maxLeft) left = maxLeft;

    const absoluteBottom = wrapperRect.top + top + menuRect.height;
    if (absoluteBottom > viewportH) {
      const overflow = absoluteBottom - viewportH;
      top -= overflow;
    }

    setStyle({
      position: "absolute",
      top,
      left,
      minWidth: 180,
      background: "white",
      border: "1px solid #d1d5db",
      borderRadius: 6,
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      padding: "4px 0",
      fontSize: 14,
      zIndex: 50,
      visibility: "visible",
    });
  }, [anchorEl, wrapperEl]);

  useLayoutEffect(() => {
    recalculateStyles();
  }, [recalculateStyles, query]);

  useEffect(() => {
    const handler = () => recalculateStyles();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [recalculateStyles]);

  return (
    <div ref={menuRef} style={style}>
      {options.length === 0 && (
        <div className="px-3 py-1 text-gray-500">No matches</div>
      )}
      {options.map((option, i) => (
        <div
          key={option.key}
          onMouseEnter={() => setHighlightedIndex(i)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(option);
          }}
          className={`px-3 py-1 cursor-pointer ${
            i === selectedIndex
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          @{option.name}
        </div>
      ))}
    </div>
  );
}
