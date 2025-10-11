import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import type { ComponentProps } from "react";

export interface ButtonWithTooltipProps {
  buttonProps: ComponentProps<typeof Button>;
  tooltipContent: React.ReactNode;
  tooltipProps?: ComponentProps<typeof Tooltip>;
}

export const ButtonWithTooltip = ({
  buttonProps,
  tooltipContent,
  tooltipProps,
}: ButtonWithTooltipProps) => {
  return (
    <Tooltip {...(tooltipProps || {})}>
      <TooltipTrigger>
        {buttonProps && <Button {...buttonProps} />}
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
};
