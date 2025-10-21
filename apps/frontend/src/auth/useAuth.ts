import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest, meRequest } from "./auth-api";
import type { AuthUser } from "./auth-api";
import { useEffect } from "react";

const TOKEN_KEY = "authToken";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const useAuth = () => {
  const qc = useQueryClient();
  const token = getStoredToken();

  const meQuery = useQuery<AuthUser | null>({
    queryKey: ["auth", "me", token],
    // Treat auth failures as unauthenticated instead of error-loop
    queryFn: async () => {
      if (!token) return null;
      try {
        return await meRequest();
      } catch {
        // Invalid/expired token -> clear and return null
        setStoredToken(null);
        return null;
      }
    },
    enabled: !!token,
    retry: false,
    staleTime: 60_000,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const data = await loginRequest(email.trim().toLowerCase(), password);
      setStoredToken(data.accessToken);
      return data.user;
    },
    onSuccess: (user) => {
      qc.setQueryData(["auth", "me", getStoredToken()], user);
    },
  });

  const logout = () => {
    setStoredToken(null);
    qc.invalidateQueries({ queryKey: ["auth", "me"] });
    qc.setQueryData(["auth", "me", null], null);
  };

  // Effect to refetch when token changes
  useEffect(() => {
    if (token) {
      qc.invalidateQueries({ queryKey: ["auth", "me", token] });
    }
  }, [token, qc]);

  return {
    user: meQuery.data,
    token,
    isLoading: !!token && meQuery.isLoading,
    isAuthenticated: !!meQuery.data && !!token,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    loginStatus: loginMutation.status,
    logout,
  };
};
