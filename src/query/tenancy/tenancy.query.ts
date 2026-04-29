import { Request } from "express";

export type TenancyQuery = {
  filters: {
    status?: "ACTIVE" | "TERMINATED";
    propertyId?: string;
    tenantId?: string;
    landlordId?: string;
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

export const parseTenancyQuery = (req: Request): TenancyQuery => {
  const {
    status,
    propertyId,
    tenantId,
    landlordId,
    search,
    sort,
    page = "1",
    limit = "10",
  } = req.query;

  const allowedFields = ["createdAt", "startDate", "endDate", "status"];

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
      propertyId: typeof propertyId === "string" ? propertyId : undefined,
      tenantId: typeof tenantId === "string" ? tenantId : undefined,
      landlordId: typeof landlordId === "string" ? landlordId : undefined,
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