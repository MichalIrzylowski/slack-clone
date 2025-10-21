import { api } from "@/api/client";

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function loginRequest(email: string, password: string) {
  const res = await api.auth.authControllerLogin({ email, password });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Login failed");
  }
  return res.json() as Promise<{ accessToken: string; user: AuthUser }>; // shape from backend
}

export async function meRequest() {
  const res = await api.auth.authControllerMe();
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json() as Promise<AuthUser>;
}
