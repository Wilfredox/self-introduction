import type { Request, Response } from "express";
import { sendError } from "../utils/api-response.js";

export function notFoundHandler(_request: Request, response: Response) {
  return sendError(response, 404, "Route not found", "ROUTE_NOT_FOUND");
}
