import { useAuth } from "@/auth/useAuth";
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND_URL) console.warn("BACKEND_URL not set");

const USERS_QUERY_KEY = ["users"];

export const useGetUsers = () => {
  const auth = useAuth();
  if (!auth.user || !auth.token) throw new Error("Not authenticated");

  const query = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  return query;
};
