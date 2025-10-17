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
    <div
      className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg"
      ref={menuRef}
      style={style}
    >
      {options.map((option, i) => {
        const active = i === selectedIndex;
        return (
          <div
            role="option"
            aria-selected={active}
            key={option.key}
            onMouseEnter={() => setHighlightedIndex(i)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(option);
            }}
            className={`flex items-center gap-2 rounded-sm px-3 py-1.5 cursor-pointer select-none
              ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}
              transition-colors`}
          >
            @{option.name}
          </div>
        );
      })}
    </div>
  );
}
