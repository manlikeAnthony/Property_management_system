import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/api/user";
import { propertyApi } from "@/services/api/property";
import { landlordApi } from "@/services/api/landlord";
import { ownershipApi } from "@/services/api/ownership";
import type { PropertyFilters } from "@/types/property";
import type { QueryOptions } from "@/types/api";

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await userApi.currentUser()).data,
    retry: false,
  });

export const useUsersQuery = (
  params?: QueryOptions & { role?: string; status?: string },
) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: async () => (await userApi.listUsers(params)).data,
  });

export const useUserQuery = (id?: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => (await userApi.getUser(id as string)).data,
    enabled: Boolean(id),
  });

export const usePropertiesQuery = (filters?: PropertyFilters & QueryOptions) =>
  useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => (await propertyApi.listProperties(filters)).data,
  });

export const usePropertyQuery = (id?: string) =>
  useQuery({
    queryKey: ["property", id],
    queryFn: async () => (await propertyApi.getProperty(id as string)).data,
    enabled: Boolean(id),
  });

export const useLandlordsQuery = (
  params?: QueryOptions & { status?: string },
) =>
  useQuery({
    queryKey: ["landlords", params],
    queryFn: async () => (await landlordApi.listLandlords(params)).data,
  });

export const useLandlordProfileQuery = () =>
  useQuery({
    queryKey: ["landlord-profile"],
    queryFn: async () => (await landlordApi.myProfile()).data,
  });

export const useLandlordApplicationsQuery = (params?: QueryOptions) =>
  useQuery({
    queryKey: ["landlord-applications", params],
    queryFn: async () => (await landlordApi.applications(params)).data,
  });

export const useApprovedLandlordsQuery = (params?: QueryOptions) =>
  useQuery({
    queryKey: ["approved-landlords", params],
    queryFn: async () => (await landlordApi.approved(params)).data,
  });

export const useRejectedLandlordsQuery = (params?: QueryOptions) =>
  useQuery({
    queryKey: ["rejected-landlords", params],
    queryFn: async () => (await landlordApi.rejected(params)).data,
  });

export const useOwnershipHistoryQuery = (
  propertyId?: string,
  params?: QueryOptions & { ownerId?: string; active?: boolean },
) =>
  useQuery({
    queryKey: ["ownership-history", propertyId, params],
    queryFn: async () =>
      (await ownershipApi.history(propertyId as string, params)).data,
    enabled: Boolean(propertyId),
  });

export const useCurrentOwnerQuery = (propertyId?: string) =>
  useQuery({
    queryKey: ["current-owner", propertyId],
    queryFn: async () =>
      (await ownershipApi.currentOwner(propertyId as string)).data,
    enabled: Boolean(propertyId),
  });
