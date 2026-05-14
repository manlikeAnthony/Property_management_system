import { api } from "@/services/api/client";
import type {
  ApiResponse,
  PaginatedCollection,
  QueryOptions,
} from "@/types/api";
import type { LandlordProfile } from "@/types/landlord";

export const landlordApi = {
  listLandlords: async (params?: QueryOptions & { status?: string }) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<LandlordProfile> | LandlordProfile[]>
    >("/landlord", {
      params,
    });
    return data;
  },
  becomeLandlord: async () => {
    const { data } = await api.post<ApiResponse<LandlordProfile>>(
      "/landlord/become-landlord",
    );
    return data;
  },
  myProfile: async () => {
    const { data } = await api.get<ApiResponse<LandlordProfile>>(
      "/landlord/my-profile",
    );
    return data;
  },
  applications: async (params?: QueryOptions) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<LandlordProfile> | LandlordProfile[]>
    >("/landlord/applications", {
      params,
    });
    return data;
  },
  approved: async (params?: QueryOptions) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<LandlordProfile> | LandlordProfile[]>
    >("/landlord/approved", {
      params,
    });
    return data;
  },
  rejected: async (params?: QueryOptions) => {
    const { data } = await api.get<
      ApiResponse<PaginatedCollection<LandlordProfile> | LandlordProfile[]>
    >("/landlord/rejected", {
      params,
    });
    return data;
  },
  getLandlord: async (id: string) => {
    const { data } = await api.get<ApiResponse<LandlordProfile>>(
      `/landlord/${id}`,
    );
    return data;
  },
  approveLandlord: async (id: string) => {
    const { data } = await api.patch<ApiResponse<LandlordProfile>>(
      `/landlord/approve/${id}`,
    );
    return data;
  },
  rejectLandlord: async (id: string) => {
    const { data } = await api.patch<ApiResponse<LandlordProfile>>(
      `/landlord/reject/${id}`,
    );
    return data;
  },
  deleteLandlord: async (id: string) => {
    const { data } = await api.delete<ApiResponse<LandlordProfile>>(
      `/landlord/${id}`,
    );
    return data;
  },
};
