import type { Property } from "@/types/property";
import type { User } from "@/types/user";

export type Ownership = {
  _id: string;
  property: Property | string;
  owner: User | string;
  acquiredAt?: string;
  disposedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
