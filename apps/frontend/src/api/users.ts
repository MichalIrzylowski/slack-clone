import { useQuery } from "@tanstack/react-query";
import { api } from "./client";

const USERS_QUERY_KEY = ["users"];

export const useGetUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.users.usersControllerFindAll();

      const { data, status } = response;
      if (status !== 200 || !data) throw new Error("Failed to fetch users");
      return data;
    },
  });
};
