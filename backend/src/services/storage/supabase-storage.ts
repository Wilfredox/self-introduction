import { createClient } from "@supabase/supabase-js";
import type { AssetKind } from "@prisma/client";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";
import { buildAssetObjectKey, buildStoredFileName } from "./file-meta.js";
import type { StoredAssetPayload } from "./types.js";

const supabase =
  env.storageProvider === "supabase" && env.supabaseUrl && env.supabaseServiceRoleKey
    ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : null;

function getSupabaseClient() {
  if (!supabase) {
    throw new AppError(500, "Supabase client is not configured", "SUPABASE_STORAGE_NOT_CONFIGURED");
  }

  return supabase;
}

export async function storeSupabaseAsset(file: Express.Multer.File, kind: AssetKind): Promise<StoredAssetPayload> {
  const fileName = buildStoredFileName(file);
  const objectKey = buildAssetObjectKey(kind, fileName);
  const bucket = getSupabaseClient().storage.from(env.supabaseStorageBucket);
  const { error: uploadError } = await bucket.upload(objectKey, file.buffer, {
    contentType: file.mimetype,
    cacheControl: "3600",
    upsert: false
  });

  if (uploadError) {
    throw new AppError(
      500,
      `Supabase Storage upload failed: ${uploadError.message}`,
      "SUPABASE_STORAGE_UPLOAD_FAILED"
    );
  }

  const { data } = bucket.getPublicUrl(objectKey);

  return {
    kind,
    fileName,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    storageProvider: "supabase",
    objectKey,
    url: data.publicUrl,
    previewUrl: data.publicUrl
  };
}
