import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";
import { env } from "../config/env.js";

export async function requireAdminAuth(request: Request, _response: Response, next: NextFunction) {
  const sessionToken = request.cookies?.[env.sessionCookieName];

  if (!sessionToken) {
    return next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
  }

  const session = await authService.getSessionByToken(sessionToken);

  if (!session) {
    return next(new AppError(401, "Invalid or expired session", "INVALID_SESSION"));
  }

  request.adminSession = {
    sessionId: session.id,
    adminUserId: session.adminUser.id,
    username: session.adminUser.username
  };

  next();
}
