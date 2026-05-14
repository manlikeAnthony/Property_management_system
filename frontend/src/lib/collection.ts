import type { PaginatedCollection } from "@/types/api";

export const normalizeCollection = <T>(
  payload?: PaginatedCollection<T> | T[] | null,
) => {
  if (!payload) return [] as T[];
  if (Array.isArray(payload)) return payload;

  return payload.docs ?? payload.data ?? payload.items ?? payload.results ?? [];
};

export const getCollectionMeta = <T>(
  payload?: PaginatedCollection<T> | T[] | null,
) => {
  if (!payload || Array.isArray(payload)) return undefined;

  return payload.meta ?? payload.pagination;
};
