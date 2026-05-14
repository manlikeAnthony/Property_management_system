import type { User } from "@/types/user";

export type PropertyType = "SALE" | "RENT";
export type PropertyStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RENTED"
  | "PARTIALLY_OCCUPIED";

export type PropertyImage = {
  url: string;
  key: string;
};

export type PropertyAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
};

export type Property = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  type: PropertyType;
  status: PropertyStatus;
  address: PropertyAddress;
  formattedAddress?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  owner?: User | string;
  listedBy?: User | string;
  images: PropertyImage[];
  isPublished: boolean;
  maxTenants: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PropertyFilters = {
  type?: PropertyType;
  city?: string;
  state?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
};

export type PropertyFormValues = {
  title: string;
  description?: string;
  price: number;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  street: string;
  city: string;
  state: string;
  country: string;
  images: File[];
};
