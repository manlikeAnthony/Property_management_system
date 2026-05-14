import type { User } from "@/types/user";

export type LandlordProfile = User & {
  landlordProfile?: User["landlordProfile"];
};
