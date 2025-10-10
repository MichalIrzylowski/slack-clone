import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/auth/useAuth";

interface RedirectState {
  from?: { pathname?: string };
}

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState<string | null>(null);
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    if (!values.email.trim() || !values.password) {
      setError("Email and password required");
      return;
    }
    try {
      await login(values.email.trim().toLowerCase(), values.password);
      const state = location.state as RedirectState | null;
      const redirectTo = state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setError(msg);
    }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-xs">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-xs">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </div>
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="text-[10px] text-muted-foreground text-center">
        First time? Use init-admin via backend docs to create initial admin.
      </p>
    </div>
  );
};

export default Login;
