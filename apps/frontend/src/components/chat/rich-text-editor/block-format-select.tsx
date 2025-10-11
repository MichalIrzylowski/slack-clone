import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export interface BlockFormatSelectProps {
  value: string;
  options: { label: string; value: string; icon?: ReactNode }[];
  onChange: (value: string) => void;
}

export const BlockFormatSelect = ({
  value,
  options,
  onChange,
}: BlockFormatSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-36 h-8">
            <SelectValue />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>Block format</TooltipContent>
      </Tooltip>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center space-x-2 p-2"
          >
            {option.icon}
            <span>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
