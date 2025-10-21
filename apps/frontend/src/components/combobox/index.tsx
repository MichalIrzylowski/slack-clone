import { useCallback, type ReactNode } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToggle } from "rooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  triggerChild: ReactNode;
  fullWidth?: boolean;
  searchInputPlaceholder?: string;
  searchEmptyState?: ReactNode;
  options?: ComboboxOption[];
  onSelect: (value: string) => void;
}

export function Combobox({
  triggerChild,
  fullWidth = true,
  searchInputPlaceholder = "Search",
  searchEmptyState = "No results found.",
  options = [],
  onSelect,
}: ComboboxProps) {
  const [isOpen, toggleIsOpen] = useToggle(false);

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value);
      toggleIsOpen(false);
    },
    [onSelect, toggleIsOpen]
  );

  return (
    <Popover open={isOpen} onOpenChange={toggleIsOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={isOpen}
          variant="outline"
          fullWidth={fullWidth}
        >
          {triggerChild}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder={searchInputPlaceholder} />
          <CommandList>
            <CommandEmpty>{searchEmptyState}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={handleSelect}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
