import fs from "node:fs/promises";
import path from "node:path";
import type { AssetKind } from "@prisma/client";
import { env } from "../../config/env.js";
import { buildAssetObjectKey, buildStoredFileName } from "./file-meta.js";
import type { StoredAssetPayload } from "./types.js";

function toPublicUrl(objectKey: string) {
  return `${env.appBaseUrl}/uploads/${objectKey}`;
}

export async function storeLocalAsset(file: Express.Multer.File, kind: AssetKind): Promise<StoredAssetPayload> {
  const fileName = buildStoredFileName(file);
  const objectKey = buildAssetObjectKey(kind, fileName);
  const absolutePath = path.join(env.uploadRootDir, objectKey);
  const publicUrl = toPublicUrl(objectKey);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, file.buffer);

  return {
    kind,
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    storageProvider: "local",
    objectKey,
    url: publicUrl,
    previewUrl: publicUrl
  };
}
