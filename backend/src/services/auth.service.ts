import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "../utils/password.js";
import { AppError } from "../utils/errors.js";
import { env } from "../config/env.js";
import { generateSessionToken, hashSessionToken } from "../utils/session.js";
import { ensureStartupBootstrap } from "./startup-bootstrap.service.js";

async function login(input: { username: string; password: string; ip?: string; userAgent?: string }) {
  await ensureStartupBootstrap();

  const adminUser = await prisma.adminUser.findUnique({
    where: { username: input.username }
  });

  if (!adminUser) {
    throw new AppError(401, "Invalid username or password", "INVALID_CREDENTIALS");
  }

  const isValid = await verifyPassword(input.password, adminUser.passwordHash);
  if (!isValid) {
    throw new AppError(401, "Invalid username or password", "INVALID_CREDENTIALS");
  }

  const rawSessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000);

  const session = await prisma.adminSession.create({
    data: {
      adminUserId: adminUser.id,
      sessionTokenHash: hashSessionToken(rawSessionToken),
      expiresAt,
      lastUsedAt: new Date(),
      ip: input.ip,
      userAgent: input.userAgent
    }
  });

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { lastLoginAt: new Date() }
  });

  return {
    rawSessionToken,
    expiresAt,
    admin: {
      id: adminUser.id,
      username: adminUser.username
    },
    session
  };
}

async function getSessionByToken(rawToken: string) {
  const session = await prisma.adminSession.findUnique({
    where: {
      sessionTokenHash: hashSessionToken(rawToken)
    },
    include: {
      adminUser: true
    }
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.delete({
      where: { id: session.id }
    });
    return null;
  }

  await prisma.adminSession.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() }
  });

  return session;
}

async function logout(rawToken?: string) {
  if (!rawToken) {
    return;
  }

  await prisma.adminSession.deleteMany({
    where: {
      sessionTokenHash: hashSessionToken(rawToken)
    }
  });
}

export const authService = {
  login,
  getSessionByToken,
  logout
};
