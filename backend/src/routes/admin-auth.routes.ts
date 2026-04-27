import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/async-handler.js";
import { sendOk } from "../utils/api-response.js";
import { authService } from "../services/auth.service.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../validators/auth.js";
import { buildClearedSessionCookieOptions, buildSessionCookieOptions } from "../utils/session.js";
import { env } from "../config/env.js";
import { requireAdminAuth } from "../middleware/require-admin-auth.js";
import { requireAdminOrigin } from "../middleware/require-admin-origin.js";

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
});

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/login",
  loginRateLimiter,
  validateBody(loginSchema),
  asyncHandler(async (request, response) => {
    const result = await authService.login({
      username: request.body.username,
      password: request.body.password,
      ip: request.ip,
      userAgent: request.headers["user-agent"]
    });

    response.cookie(
      env.sessionCookieName,
      result.rawSessionToken,
      buildSessionCookieOptions(result.expiresAt)
    );

    return sendOk(response, {
      admin: result.admin
    });
  })
);

adminAuthRouter.post(
  "/logout",
  requireAdminAuth,
  requireAdminOrigin,
  asyncHandler(async (request, response) => {
    const sessionToken = request.cookies?.[env.sessionCookieName];
    await authService.logout(sessionToken);
    response.cookie(env.sessionCookieName, "", buildClearedSessionCookieOptions());
    return sendOk(response, { loggedOut: true });
  })
);

adminAuthRouter.get(
  "/me",
  requireAdminAuth,
  asyncHandler(async (request, response) => {
    return sendOk(response, {
      admin: {
        id: request.adminSession?.adminUserId,
        username: request.adminSession?.username
      }
    });
  })
);
