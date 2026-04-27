import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendOk } from "../utils/api-response.js";
import { requireAdminAuth } from "../middleware/require-admin-auth.js";
import { requireAdminOrigin } from "../middleware/require-admin-origin.js";
import { imageUpload, projectPdfUpload } from "../middleware/upload.js";
import { assetsService } from "../services/assets.service.js";
import { AppError } from "../utils/errors.js";

export const adminAssetsRouter = Router();

adminAssetsRouter.use(requireAdminAuth);
adminAssetsRouter.use(requireAdminOrigin);

adminAssetsRouter.post(
  "/assets/images",
  imageUpload,
  asyncHandler(async (request, response) => {
    if (!request.file) {
      throw new AppError(400, "Missing image file", "MISSING_FILE");
    }

    const asset = await assetsService.createUploadedAsset(request.file, "IMAGE");
    return sendOk(response, asset, 201);
  })
);

adminAssetsRouter.post(
  "/assets/pdfs",
  projectPdfUpload,
  asyncHandler(async (request, response) => {
    if (!request.file) {
      throw new AppError(400, "Missing PDF file", "MISSING_FILE");
    }

    const asset = await assetsService.createUploadedAsset(request.file, "PROJECT_PDF");
    return sendOk(response, asset, 201);
  })
);
