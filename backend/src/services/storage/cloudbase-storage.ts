import tcb from "@cloudbase/node-sdk";
import type { AssetKind } from "@prisma/client";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";
import { buildAssetObjectKey, buildStoredFileName } from "./file-meta.js";
import type { StoredAssetPayload } from "./types.js";

let cloudbaseApp: ReturnType<typeof tcb.init> | null = null;

function getCloudBaseApp() {
  if (cloudbaseApp) {
    return cloudbaseApp;
  }

  const initOptions: Parameters<typeof tcb.init>[0] = {};

  if (env.cloudbaseEnvId) {
    initOptions.env = env.cloudbaseEnvId;
  }

  if (env.cloudbaseSecretId && env.cloudbaseSecretKey) {
    initOptions.secretId = env.cloudbaseSecretId;
    initOptions.secretKey = env.cloudbaseSecretKey;
  }

  if (env.cloudbaseSessionToken) {
    initOptions.sessionToken = env.cloudbaseSessionToken;
  }

  cloudbaseApp = tcb.init(initOptions);
  return cloudbaseApp;
}

async function resolveCloudBaseFileUrl(fileId: string) {
  const urls = await resolveCloudBaseFileUrls([fileId]);
  const resolvedUrl = urls.get(fileId);

  if (!resolvedUrl) {
    throw new AppError(500, "CloudBase did not return a file access URL", "CLOUDBASE_FILE_URL_MISSING");
  }

  return resolvedUrl;
}

export async function resolveCloudBaseFileUrls(fileIds: string[]) {
  const uniqueFileIds = [...new Set(fileIds.map((value) => value.trim()).filter(Boolean))];

  if (uniqueFileIds.length === 0) {
    return new Map<string, string>();
  }

  const result = await getCloudBaseApp().getTempFileURL({
    fileList: uniqueFileIds
  });

  const urlMap = new Map<string, string>();

  for (const fileEntry of result.fileList ?? []) {
    if (fileEntry.fileID && fileEntry.tempFileURL) {
      urlMap.set(fileEntry.fileID, fileEntry.tempFileURL);
    }
  }

  const missingFileIds = uniqueFileIds.filter((fileId) => !urlMap.has(fileId));

  if (missingFileIds.length > 0) {
    throw new AppError(
      500,
      `CloudBase did not return file access URLs for: ${missingFileIds.join(", ")}`,
      "CLOUDBASE_FILE_URLS_MISSING"
    );
  }

  return urlMap;
}

export async function storeCloudBaseAsset(file: Express.Multer.File, kind: AssetKind): Promise<StoredAssetPayload> {
  const fileName = buildStoredFileName(file);
  const cloudPath = buildAssetObjectKey(kind, fileName);
  const uploadResult = await getCloudBaseApp().uploadFile({
    cloudPath,
    fileContent: file.buffer
  });
  const fileId = uploadResult.fileID;

  if (!fileId) {
    throw new AppError(500, "CloudBase upload did not return a file id", "CLOUDBASE_FILE_ID_MISSING");
  }

  return {
    kind,
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    storageProvider: "cloudbase",
    objectKey: fileId,
    // The Asset schema still requires url, so we persist the stable fileID here.
    // Public APIs will turn objectKey/fileID back into a current access URL at read time.
    url: fileId
  };
}
