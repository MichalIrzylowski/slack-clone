import React from "react";
import { Outlet } from "react-router";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-svh flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Acme Corp
      </footer>
    </div>
  );
};

export default AuthLayout;
