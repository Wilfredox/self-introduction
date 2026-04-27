import { env } from "../../config/env.js";
import { resolveCloudBaseFileUrls } from "./cloudbase-storage.js";

type AssetLike = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  kind: string;
  storageProvider: string;
  objectKey: string;
  url: string;
  previewUrl: string | null;
  updatedAt?: Date;
};

type AssetUrlSource = Pick<AssetLike, "storageProvider" | "objectKey" | "url" | "previewUrl">;
type AssetMapSource = Pick<AssetLike, "id" | "storageProvider" | "objectKey" | "url" | "previewUrl">;

type ResolveAssetUrlOptions = {
  cloudbaseUrlResolver?: (fileIds: string[]) => Promise<Map<string, string>>;
};

export type ResolvedAssetUrls = {
  url: string;
  previewUrl: string;
};

export type ResolvedAssetUrlMap = Map<string, ResolvedAssetUrls>;

function trimLeadingSlashes(value: string) {
  return value.replace(/^\/+/, "");
}

function buildLocalAssetUrl(objectKey: string) {
  return `${env.appBaseUrl}/uploads/${trimLeadingSlashes(objectKey)}`;
}

function buildStoredAssetUrls(asset: AssetUrlSource): ResolvedAssetUrls {
  if (asset.storageProvider === "local") {
    const publicUrl = buildLocalAssetUrl(asset.objectKey);
    return {
      url: publicUrl,
      previewUrl: publicUrl
    };
  }

  return {
    url: asset.url,
    previewUrl: asset.previewUrl ?? asset.url
  };
}

export async function resolveAssetUrlMap(
  assets: AssetMapSource[],
  options: ResolveAssetUrlOptions = {}
): Promise<ResolvedAssetUrlMap> {
  const resolvedMap: ResolvedAssetUrlMap = new Map();
  const cloudbaseAssets = assets.filter((asset) => asset.storageProvider === "cloudbase");

  for (const asset of assets) {
    if (asset.storageProvider === "cloudbase") {
      continue;
    }

    resolvedMap.set(asset.id, buildStoredAssetUrls(asset));
  }

  if (cloudbaseAssets.length === 0) {
    return resolvedMap;
  }

  const resolveCloudBaseUrls = options.cloudbaseUrlResolver ?? resolveCloudBaseFileUrls;
  const cloudbaseUrlMap = await resolveCloudBaseUrls(cloudbaseAssets.map((asset) => asset.objectKey));

  for (const asset of cloudbaseAssets) {
    const currentUrl = cloudbaseUrlMap.get(asset.objectKey) ?? asset.previewUrl ?? asset.url;
    resolvedMap.set(asset.id, {
      url: currentUrl,
      previewUrl: currentUrl
    });
  }

  return resolvedMap;
}

export function getResolvedAssetUrls(asset: AssetMapSource, resolvedMap: ResolvedAssetUrlMap) {
  return resolvedMap.get(asset.id) ?? buildStoredAssetUrls(asset);
}

export async function resolveAssetUrls(asset: AssetMapSource, options: ResolveAssetUrlOptions = {}) {
  const resolvedMap = await resolveAssetUrlMap([asset], options);
  return getResolvedAssetUrls(asset, resolvedMap);
}

export function mapAssetRefWithResolvedUrls(
  asset: Pick<AssetLike, "id" | "fileName" | "updatedAt">,
  resolved: ResolvedAssetUrls
) {
  return {
    assetId: asset.id,
    fileName: asset.fileName,
    url: resolved.url,
    previewUrl: resolved.previewUrl,
    downloadUrl: resolved.url,
    updatedAt: asset.updatedAt?.toISOString()
  };
}

export async function mapAssetRef(
  asset: Pick<AssetLike, "id" | "fileName" | "storageProvider" | "objectKey" | "url" | "previewUrl" | "updatedAt">,
  options: ResolveAssetUrlOptions = {}
) {
  const resolved = await resolveAssetUrls(asset, options);
  return mapAssetRefWithResolvedUrls(asset, resolved);
}

export function mapUploadedAssetWithResolvedUrls(
  asset: Pick<AssetLike, "id" | "kind" | "fileName" | "mimeType" | "size">,
  resolved: ResolvedAssetUrls
) {
  return {
    id: asset.id,
    kind: asset.kind,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
    size: asset.size,
    url: resolved.url,
    previewUrl: resolved.previewUrl
  };
}

export async function mapUploadedAsset(asset: AssetLike, options: ResolveAssetUrlOptions = {}) {
  const resolved = await resolveAssetUrls(asset, options);
  return mapUploadedAssetWithResolvedUrls(asset, resolved);
}
