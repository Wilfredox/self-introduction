import { AssetKind } from "@prisma/client";

export const uploadFolderByKind: Record<AssetKind, string> = {
  [AssetKind.IMAGE]: "images",
  [AssetKind.PROJECT_PDF]: "pdfs",
  [AssetKind.RESUME]: "resumes"
};

export const allowedMimeTypes: Record<AssetKind, string[]> = {
  [AssetKind.IMAGE]: ["image/jpeg", "image/png", "image/webp"],
  [AssetKind.PROJECT_PDF]: ["application/pdf"],
  [AssetKind.RESUME]: ["application/pdf"]
};

export const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
