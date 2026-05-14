import { api } from "@/services/api/client";
import type {
  ApiResponse,
  PaginatedCollection,
  QueryOptions,
} from "@/types/api";
import type { User } from "@/types/user";

export const userApi = {
  currentUser: async (options?: { skipSessionExpiredHandling?: boolean }) => {
    const { data } = await api.get<ApiResponse<User>>("/user/current-user", {
      skipSessionExpiredHandling: options?.skipSessionExpiredHandling,
    });
    return data;
  },
  listUsers: async (
    params?: QueryOptions & { role?: string; status?: string },
  ) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<User> | User[]>
    >("/user", { params });
    return data;
  },
  getUser: async (id: string) => {
    const { data } = await api.get<ApiResponse<User>>(`/user/${id}`);
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await api.delete<ApiResponse<User>>(`/user/${id}`);
    return data;
  },
};
