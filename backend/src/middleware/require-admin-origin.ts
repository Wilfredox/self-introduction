import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { safeMethods } from "../config/constants.js";
import { AppError } from "../utils/errors.js";

export function requireAdminOrigin(request: Request, _response: Response, next: NextFunction) {
  if (safeMethods.has(request.method) || env.adminAppOrigins.length === 0) {
    return next();
  }

  const origin = request.headers.origin;
  if (!origin || !env.adminAppOrigins.includes(origin)) {
    return next(new AppError(403, "Origin not allowed", "ORIGIN_NOT_ALLOWED"));
  }

  next();
}
