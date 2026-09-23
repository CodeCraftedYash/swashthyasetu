import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedUrlQuery } from "querystring";
import type { ZodType } from "zod";
import { ApiError } from "../utils/apiError.js";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

const assignRequestValue = <T>(req: Request, key: "body" | "params" | "query", value: T) => {
  Object.defineProperty(req, key, {
    value,
    configurable: true,
    writable: true,
    enumerable: true,
  });
};

export const validate = (schema: RequestSchemas) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (schema.body) {
      const result = await schema.body.safeParseAsync(req.body);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues
            .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
            .join(", "),
        );
      }
      assignRequestValue(req, "body", result.data);
    }

    if (schema.params) {
      const result = await schema.params.safeParseAsync(req.params);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      assignRequestValue(req, "params", result.data as ParamsDictionary);
    }

    if (schema.query) {
      const result = await schema.query.safeParseAsync(req.query);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      assignRequestValue(req, "query", result.data as ParsedUrlQuery);
    }

    next();
  };
};

export default validate;

