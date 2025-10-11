import { Toggle } from "./toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface ToggleWithTooltipProps {
  toggleProps: React.ComponentProps<typeof Toggle>;
  tooltipContent: React.ReactNode;
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
  tooltipTriggerProps?: React.ComponentProps<typeof TooltipTrigger>;
}

export const ToggleWithTooltip = ({
  toggleProps,
  tooltipContent,
  tooltipProps,
  tooltipTriggerProps,
}: ToggleWithTooltipProps) => {
  return (
    <Tooltip {...tooltipProps}>
      <TooltipTrigger {...tooltipTriggerProps}>
        <Toggle {...toggleProps} />
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
};
