import type { AssetKind } from "@prisma/client";

export interface StoredAssetPayload {
  kind: AssetKind;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageProvider: string;
  objectKey: string;
  url: string;
  previewUrl?: string;
}
