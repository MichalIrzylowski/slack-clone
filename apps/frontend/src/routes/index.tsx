import { Routes as LibRoutes, Route, useParams } from "react-router";
import { Home } from "./home/home";
import MainLayout from "@/components/layouts/main-layout";
import ChannelPage from "./channels/channels";
import AuthLayout from "@/components/layouts/auth-layout";
import React from "react";
import { useAuth } from "@/auth/useAuth";
import { useLocation, Navigate, Outlet } from "react-router";
import Login from "./auth/login";

// Protected route wrapper: requires authentication
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading: loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6 text-sm">Loading...</div>;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
};

// Guest route wrapper: redirects authenticated users away from auth pages
const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading: loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6 text-sm">Loading...</div>;
  if (isAuthenticated) {
    const state = location.state as { from?: { pathname?: string } } | null;
    const redirectTo = state?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

// Wrapper to extract channelId param for MainLayout active highlighting
const ChannelLayoutWrapper: React.FC = () => {
  const { channelId } = useParams();
  return <MainLayout currentChannelId={channelId} />;
};

export const Routes = () => (
  <LibRoutes>
    {/* Guest only */}
    <Route element={<GuestRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Route>
    {/* Protected app */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<ChannelLayoutWrapper />}>
        <Route path="/channels/:channelId" element={<ChannelPage />} />
      </Route>
    </Route>
  </LibRoutes>
);
