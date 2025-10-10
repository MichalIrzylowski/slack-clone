import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/auth/useAuth";

interface RedirectState {
  from?: { pathname?: string };
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { register, handleSubmit } = useForm<{
    name: string;
    password: string;
  }>({
    defaultValues: { name: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    if (!values.name.trim() || !values.password) {
      setError("Name and password required");
      return;
    }
    try {
      setSubmitting(true);
      await login(values.name.trim().toLowerCase(), values.password);
      const state = location.state as RedirectState | null;
      const redirectTo = state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" htmlFor="name">
            Username
          </label>
          <input
            id="name"
            type="text"
            autoComplete="username"
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
            {...register("name")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
            {...register("password")}
          />
        </div>
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="h-9 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-[10px] text-muted-foreground text-center">
        First time? Use init-admin via backend docs to create initial admin.
      </p>
    </div>
  );
};

export default Login;
