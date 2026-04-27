import type { AssetKind } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { storeAsset } from "./storage/store-asset.js";
import { mapUploadedAsset } from "./storage/public-asset.js";
import { AppError } from "../utils/errors.js";

async function createUploadedAsset(file: Express.Multer.File, kind: AssetKind) {
  const storedAsset = await storeAsset(file, kind);

  const asset = await prisma.asset.create({
    data: storedAsset
  });

  return await mapUploadedAsset(asset);
}

async function assertAssetKinds(expected: Array<{ id: string; kind: AssetKind }>) {
  if (expected.length === 0) {
    return;
  }

  const assets = await prisma.asset.findMany({
    where: {
      id: { in: expected.map((item) => item.id) }
    }
  });

  if (assets.length !== expected.length) {
    throw new AppError(400, "One or more asset ids are invalid", "INVALID_ASSET_REFERENCE");
  }

  for (const item of expected) {
    const asset = assets.find((entry) => entry.id === item.id);
    if (!asset || asset.kind !== item.kind) {
      throw new AppError(400, `Asset ${item.id} kind mismatch`, "INVALID_ASSET_KIND");
    }
  }
}

export const assetsService = {
  createUploadedAsset,
  assertAssetKinds
};
