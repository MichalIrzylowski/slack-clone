import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useCallback, useMemo, useState, type RefObject } from "react";
import ReactDOM from "react-dom";
import { MentionsMenu } from "./mentions-menu";
import { MenuOption } from "./menu-option";
import type { TextNode } from "lexical";
import { $createMentionNode } from "../../../nodes/mention-node";

export interface MentionsPluginProps<T extends { id: string; name: string }> {
  wrapperRef: RefObject<HTMLDivElement | null>;
  options: T[];
}

const optionSearch = (queryString: string | null, options: MenuOption[]) => {
  if (!queryString || !queryString.length) return options;
  return options.filter((option) =>
    option.name.toLowerCase().includes(queryString.toLowerCase())
  );
};

export function MentionsPlugin<T extends { id: string; name: string }>({
  wrapperRef,
  options,
}: MentionsPluginProps<T>) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
  });

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const menuMatch = checkForTriggerMatch(text, editor);

      return menuMatch;
    },
    [checkForTriggerMatch, editor]
  );

  const menuOptions = useMemo(() => {
    return optionSearch(
      queryString,
      options.map((option) => new MenuOption(option.name, option.id))
    );
  }, [options, queryString]);

  const handleSelect = useCallback(
    (
      selectOption: MenuOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectOption.id,
          selectOption.name
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }

        mentionNode.select();
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      triggerFn={checkForMentionMatch}
      options={menuOptions}
      onSelectOption={handleSelect}
      menuRenderFn={(
        anchorRef,
        { selectedIndex, setHighlightedIndex, selectOptionAndCleanUp }
      ) => {
        const anchor = anchorRef.current;
        const wrapper = wrapperRef.current;

        if (!anchor || !wrapper || !menuOptions.length) return null;

        return ReactDOM.createPortal(
          <MentionsMenu
            anchorEl={anchor}
            wrapperEl={wrapper}
            query={queryString}
            onSelect={selectOptionAndCleanUp}
            selectedIndex={selectedIndex}
            setHighlightedIndex={setHighlightedIndex}
            options={menuOptions}
          />,
          wrapper
        );
      }}
    />
  );
}
