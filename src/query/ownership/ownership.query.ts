import { Request } from "express";

export type OwnershipQuery = {
  filters: {
    propertyId?: string;
    ownerId?: string;
    active?: boolean;
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

export const parseOwnershipQuery = (req: Request): OwnershipQuery => {
  const {
    propertyId,
    ownerId,
    active,
    search,
    sort,
    page = "1",
    limit = "10",
  } = req.query;

  const allowedFields = ["createdAt", "acquiredAt", "disposedAt"];

  let sortField = "acquiredAt";
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
      propertyId: typeof propertyId === "string" ? propertyId : undefined,
      ownerId: typeof ownerId === "string" ? ownerId : undefined,
      active:
        typeof active === "string" ? active === "true" : undefined,
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