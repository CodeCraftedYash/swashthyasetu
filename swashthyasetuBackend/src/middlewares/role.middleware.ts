import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (allowedRoles.length === 0) {
      next();
      return;
    }

    const hasAccess = !!userRole && allowedRoles.includes(userRole);
    if (!hasAccess) {
      next(new ApiError(403, "You are not authorized to perform this action"));
      return;
    }

    next();
  };
};
