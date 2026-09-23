import type { UserRole } from "../generated/prisma/client.js";

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}