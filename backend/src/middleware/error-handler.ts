import { Prisma } from "@prisma/client";
import { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/api-response.js";
import { AppError } from "../utils/errors.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return sendError(response, error.statusCode, error.message, error.code);
  }

  if (error instanceof ZodError) {
    return sendError(response, 400, error.issues.map((issue) => issue.message).join("; "), "VALIDATION_ERROR");
  }

  if (error instanceof MulterError) {
    return sendError(response, 400, error.message, "UPLOAD_ERROR");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return sendError(response, 409, "Unique field conflict", "UNIQUE_CONSTRAINT_ERROR");
    }
  }

  console.error(error);
  return sendError(response, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
}
