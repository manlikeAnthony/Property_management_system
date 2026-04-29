import { Request } from "express";

export type LandlordQuery = {
  filters: {
    status?: "APPROVED" | "PENDING" | "REJECTED";
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    skip: number;
  };
  sort: {
    field: string;
    order: 1 | -1;
  };
};

export const parseLandlordQuery = (req: Request): LandlordQuery => {
  const {
    status,
    search,
    sort,
    page = "1",
    limit = "10",
  } = req.query;

  const allowedFields = ["createdAt", "updatedAt", "name"];

  let sortField = "createdAt";
  let sortOrder: 1 | -1 = -1;

  if (typeof sort === "string") {
    if (sort.startsWith("-")) {
      const field = sort.slice(1);
      if (allowedFields.includes(field)) {
        sortField = field;
        sortOrder = -1;
      }
    } else {
      if (allowedFields.includes(sort)) {
        sortField = sort;
        sortOrder = 1;
      }
    }
  }

  return {
    filters: {
      status: typeof status === "string" ? (status as any) : undefined,
      search: typeof search === "string" ? search.trim() : undefined,
    },
    pagination: {
      page: Math.max(1, Number(page)),
      limit: Math.max(1, Number(limit)),
      skip: (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit)),
    },
    sort: {
      field: sortField,
      order: sortOrder,
    },
  };
};