import type { AssetKind } from "@prisma/client";
import { env } from "../../config/env.js";
import { storeCloudBaseAsset } from "./cloudbase-storage.js";
import { storeLocalAsset } from "./local-storage.js";
import { storeSupabaseAsset } from "./supabase-storage.js";

export async function storeAsset(file: Express.Multer.File, kind: AssetKind) {
  if (env.storageProvider === "cloudbase") {
    return storeCloudBaseAsset(file, kind);
  }

  if (env.storageProvider === "supabase") {
    return storeSupabaseAsset(file, kind);
  }

  return storeLocalAsset(file, kind);
}
