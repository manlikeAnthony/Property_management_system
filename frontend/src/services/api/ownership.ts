import { api } from "@/services/api/client";
import type {
  ApiResponse,
  PaginatedCollection,
  QueryOptions,
} from "@/types/api";
import type { Ownership } from "@/types/ownership";

export const ownershipApi = {
  purchaseProperty: async (propertyId: string) => {
    const { data } = await api.post<ApiResponse<null>>(
      `/ownership/purchase/${propertyId}`,
    );
    return data;
  },
  transferOwnership: async (propertyId: string, newOwnerId: string) => {
    const { data } = await api.post<ApiResponse<null>>(
      `/ownership/transfer/${propertyId}`,
      {
        newOwnerId,
      },
    );
    return data;
  },
  history: async (
    propertyId: string,
    params?: QueryOptions & { ownerId?: string; active?: boolean },
  ) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<Ownership> | Ownership[]>
    >(`/ownership/history/${propertyId}`, {
      params,
    });
    return data;
  },
  currentOwner: async (propertyId: string) => {
    const { data } = await api.get<ApiResponse<Ownership>>(
      `/ownership/current-owner/${propertyId}`,
    );
    return data;
  },
  getOwnership: async (id: string) => {
    const { data } = await api.get<ApiResponse<Ownership>>(`/ownership/${id}`);
    return data;
  },
  deleteOwnership: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/ownership/${id}`);
    return data;
  },
};
