import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";

export interface RootContextProps {
  children: ReactNode;
}

export const RootContext = ({ children }: RootContextProps) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};
