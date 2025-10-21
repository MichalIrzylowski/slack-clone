import { getStoredToken } from "@/auth/useAuth";
import { Api } from "./__generated__/Api";

export const api = new Api({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  securityWorker: () => {
    const token = getStoredToken();

    if (!token) return {};
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
});
