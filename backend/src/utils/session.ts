import crypto from "node:crypto";
import type { CookieOptions } from "express";
import { env } from "../config/env.js";

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function buildSessionCookieOptions(expiresAt: Date): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    expires: expiresAt,
    path: "/"
  };
}

export function buildClearedSessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    expires: new Date(0),
    path: "/"
  };
}
