import multer from "multer";
import type { AssetKind } from "@prisma/client";
import { allowedMimeTypes } from "../config/constants.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

function buildSingleFileUpload(kind: AssetKind, maxBytes: number) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxBytes,
      files: 1
    },
    fileFilter: (_request, file, callback) => {
      if (!allowedMimeTypes[kind].includes(file.mimetype)) {
        callback(new AppError(400, `Unsupported file type: ${file.mimetype}`, "UNSUPPORTED_FILE_TYPE"));
        return;
      }

      callback(null, true);
    }
  }).single("file");
}

export const imageUpload = buildSingleFileUpload("IMAGE", env.maxImageUploadBytes);
export const projectPdfUpload = buildSingleFileUpload("PROJECT_PDF", env.maxPdfUploadBytes);
export const resumeUpload = buildSingleFileUpload("RESUME", env.maxResumeUploadBytes);
