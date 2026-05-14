export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
  code?: string;
};

export type ApiErrorPayload = {
  success?: false;
  message?: string;
  error?: unknown;
  code?: string;
};

export type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type PaginatedCollection<T> = {
  docs?: T[];
  data?: T[];
  items?: T[];
  results?: T[];
  meta?: PaginationMeta;
  pagination?: PaginationMeta;
  total?: number;
};

export type QueryOptions = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};
