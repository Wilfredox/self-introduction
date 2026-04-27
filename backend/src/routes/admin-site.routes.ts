import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendOk } from "../utils/api-response.js";
import { requireAdminAuth } from "../middleware/require-admin-auth.js";
import { requireAdminOrigin } from "../middleware/require-admin-origin.js";
import { siteService } from "../services/site.service.js";
import { validateBody } from "../middleware/validate.js";
import { updateSiteSchema } from "../validators/site.js";
import { resumeUpload } from "../middleware/upload.js";
import { assetsService } from "../services/assets.service.js";
import { AppError } from "../utils/errors.js";

export const adminSiteRouter = Router();

adminSiteRouter.use(requireAdminAuth);
adminSiteRouter.use(requireAdminOrigin);

adminSiteRouter.get(
  "/site",
  asyncHandler(async (_request, response) => {
    return sendOk(response, await siteService.getAdminSite());
  })
);

adminSiteRouter.patch(
  "/site",
  validateBody(updateSiteSchema),
  asyncHandler(async (request, response) => {
    return sendOk(response, await siteService.updateSite(request.body));
  })
);

adminSiteRouter.put(
  "/resume",
  resumeUpload,
  asyncHandler(async (request, response) => {
    const file = request.file;
    if (!file) {
      throw new AppError(400, "Missing resume file", "MISSING_FILE");
    }

    const asset = await assetsService.createUploadedAsset(file, "RESUME");
    return sendOk(response, await siteService.replaceResume(asset.id));
  })
);
