import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { type RefreshTokenPayload, AccessTokenPayload } from "../types/jwtPayload.type";

class TokenService {
  static generateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  static verifyAccessToken(token: string):AccessTokenPayload {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  }

  static verifyRefreshToken(token: string):RefreshTokenPayload {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  }
}

export default TokenService;
