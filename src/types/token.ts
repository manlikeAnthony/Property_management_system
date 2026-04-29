import type { Role } from "../models/user.model";

export interface TokenUser {
  userId: string;
  roles: Role[];
  name: string;
}

export interface AccessTokenPayload {
  user: TokenUser;
}

export interface RefreshTokenPayload {
  user: TokenUser;
  refreshToken: string;
}
