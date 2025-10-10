import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { QueryProvider } from "@/auth/query-provider";

export interface RootContextProps {
  children: ReactNode;
}

export const RootContext = ({ children }: RootContextProps) => {
  return (
    <BrowserRouter>
      <QueryProvider>{children}</QueryProvider>
    </BrowserRouter>
  );
};
