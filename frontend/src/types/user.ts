export type UserRole = "USER" | "ADMIN" | "LANDLORD";
export type LandlordApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "REVOKED";

export type User = {
  _id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatar?: string;
  accountStatus: AccountStatus;
  isVerified: boolean;
  landlordProfile?: {
    applicationStatus?: LandlordApplicationStatus;
    isActiveLandlord?: boolean;
    businessName?: string;
    logo?: string;
    approvedAt?: string;
    rejectedAt?: string;
    deactivatedAt?: string;
    revokedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSession = {
  user: User | null;
  isAuthenticated: boolean;
};
