import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
}
