import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("UNCAUGHT_ERROR", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
