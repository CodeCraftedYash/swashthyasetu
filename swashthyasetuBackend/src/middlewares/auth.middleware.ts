import type { NextFunction, Request, Response } from "express";
import TokenService from "../services/token.service.js";
import { ApiError } from "../utils/apiError.js";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError(401, "Unauthorized");
  }

  const [scheme, token] = authHeader.split(" ");
  if (!scheme || !token || scheme !== "Bearer") {
    throw new ApiError(401, "Invalid authorization header");
  }

  const payload = TokenService.verifyAccessToken(token);
  req.user = payload;
  next();
};

export default authMiddleware;
