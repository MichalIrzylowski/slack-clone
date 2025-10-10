export interface AuthUser {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const BACKEND = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND) console.warn("VITE_BACKEND_URL not set");

export async function loginRequest(email: string, password: string) {
  if (!BACKEND) throw new Error("Backend URL not configured");
  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Login failed");
  }
  return res.json() as Promise<{ accessToken: string; user: AuthUser }>; // shape from backend
}

export async function meRequest(token: string) {
  if (!BACKEND) throw new Error("Backend URL not configured");
  const res = await fetch(`${BACKEND}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json() as Promise<AuthUser>;
}
