import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode = 200,
  message = "Success",
  data: unknown = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode = 500,
  message = "Something went wrong",
  errors: unknown[] = [],
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
