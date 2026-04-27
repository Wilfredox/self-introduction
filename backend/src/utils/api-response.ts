import type { Response } from "express";

export function sendOk(response: Response, data: unknown, statusCode = 200) {
  return response.status(statusCode).json({
    success: true,
    data
  });
}

export function sendError(response: Response, statusCode: number, message: string, code?: string) {
  return response.status(statusCode).json({
    success: false,
    error: {
      code: code ?? "REQUEST_FAILED",
      message
    }
  });
}
