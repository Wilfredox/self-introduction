import crypto from "node:crypto";
import path from "node:path";
import type { AssetKind } from "@prisma/client";
import { uploadFolderByKind } from "../../config/constants.js";

const fallbackExtensionByMimeType: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

export function getSafeExtension(file: Pick<Express.Multer.File, "originalname" | "mimetype">) {
  const originalExtension = path.extname(file.originalname).toLowerCase();

  if (originalExtension) {
    return originalExtension;
  }

  return fallbackExtensionByMimeType[file.mimetype] ?? "";
}

export function buildStoredFileName(file: Pick<Express.Multer.File, "originalname" | "mimetype">) {
  return `${crypto.randomUUID()}${getSafeExtension(file)}`;
}

export function buildAssetObjectKey(kind: AssetKind, fileName: string) {
  return `${uploadFolderByKind[kind]}/${fileName}`.replace(/\\/g, "/");
}
