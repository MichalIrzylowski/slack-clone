import { Routes as LibRoutes, Route } from "react-router";
import { Home } from "./home/main";
import MainLayout from "@/components/Layouts/MainLayout";
import AuthLayout from "@/components/Layouts/AuthLayout";
import React from "react";

// Placeholder Login component (replace with real implementation later)
const Login = React.lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <form className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            />
          </div>
          <button
            type="submit"
            className="h-9 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    ),
  })
);

export const Routes = () => (
  <LibRoutes>
    {/* Auth routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
    </Route>
    {/* App shell routes */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>
  </LibRoutes>
);
