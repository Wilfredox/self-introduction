import { AccentTone, PublicAssetRef } from "../types/content";

const PDF_DATA_URL =
  "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA1IDAgUiA+PiA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCAxMDUgPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgo3MiA3NjAgVGQKKE1vY2sgUG9ydGZvbGlvIFBERiBQcmV2aWV3KSBUagowIC0zNiBUZAovRjEgMTIgVGYKKFNlY29uZCByb3VuZCBmcm9udC1lbmQgcGxhY2Vob2xkZXIgYXNzZXQuKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDM5NiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQ2NgolJUVPRg==";

const TONES: Record<AccentTone, string> = {
  olive: "#6c7750",
  rust: "#b96d49",
  slate: "#6e8888",
  charcoal: "#2a2f29",
  marine: "#2f5376",
  sand: "#8c795d"
};

function svgDataUrl(markup: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}

function fileDataUrl(text: string, mimeType: string) {
  return `data:${mimeType};charset=UTF-8,${encodeURIComponent(text)}`;
}

function publicAssetUrl(path: string) {
  const normalized = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${normalized}`;
}

function createPosterSvg(title: string, subtitle: string, accent: string, badge: string) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 960">
      <rect width="800" height="960" fill="#f6f0e7"/>
      <rect x="28" y="28" width="744" height="904" fill="#fbf7f0" stroke="rgba(21,21,21,0.10)"/>
      <rect x="64" y="84" width="672" height="96" fill="${accent}" opacity="0.14"/>
      <rect x="64" y="212" width="672" height="372" fill="${accent}" opacity="0.2"/>
      <rect x="104" y="250" width="592" height="42" fill="#ffffff" opacity="0.82"/>
      <rect x="104" y="320" width="292" height="196" fill="#ffffff" opacity="0.65"/>
      <rect x="432" y="332" width="212" height="112" fill="#ffffff" opacity="0.55"/>
      <text x="64" y="652" fill="#161616" font-size="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-weight="700">${title}</text>
      <text x="64" y="702" fill="#615c55" font-size="22" font-family="Segoe UI, Microsoft YaHei, sans-serif">${subtitle}</text>
      <rect x="64" y="758" width="196" height="42" rx="21" fill="#ffffff" stroke="${accent}" opacity="0.9"/>
      <text x="92" y="785" fill="${accent}" font-size="18" font-family="Segoe UI, Microsoft YaHei, sans-serif">${badge}</text>
    </svg>
  `);
}

function createStoryboardSvg(title: string, accent: string, caption: string) {
  return svgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">
      <rect width="1440" height="900" fill="#f7f2ea"/>
      <rect x="36" y="36" width="1368" height="828" fill="#fdf9f2" stroke="rgba(21,21,21,0.10)"/>
      <rect x="72" y="82" width="1296" height="86" fill="${accent}" opacity="0.14"/>
      <rect x="72" y="210" width="780" height="420" fill="${accent}" opacity="0.18"/>
      <rect x="896" y="210" width="472" height="180" fill="#ffffff" stroke="rgba(21,21,21,0.08)"/>
      <rect x="896" y="420" width="472" height="210" fill="#ffffff" stroke="rgba(21,21,21,0.08)"/>
      <text x="92" y="128" fill="#171717" font-size="34" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-weight="700">${title}</text>
      <text x="92" y="684" fill="#615c55" font-size="26" font-family="Segoe UI, Microsoft YaHei, sans-serif">${caption}</text>
    </svg>
  `);
}

export function createImageAsset(
  id: string,
  title: string,
  subtitle: string,
  tone: AccentTone,
  badge: string
): PublicAssetRef {
  const previewUrl = createPosterSvg(title, subtitle, TONES[tone], badge);

  return {
    assetId: id,
    fileName: `${id}.svg`,
    url: previewUrl,
    previewUrl
  };
}

export function createStoryboardAsset(
  id: string,
  title: string,
  tone: AccentTone,
  caption: string
): PublicAssetRef {
  const previewUrl = createStoryboardSvg(title, TONES[tone], caption);

  return {
    assetId: id,
    fileName: `${id}.svg`,
    url: previewUrl,
    previewUrl
  };
}

export function createPdfAsset(id: string, fileName: string): PublicAssetRef {
  return {
    assetId: id,
    fileName,
    mimeType: "application/pdf",
    url: PDF_DATA_URL,
    previewUrl: PDF_DATA_URL,
    downloadUrl: PDF_DATA_URL
  };
}

export function createDownloadAsset(
  id: string,
  fileName: string,
  text: string,
  mimeType = "text/plain"
): PublicAssetRef {
  const downloadUrl = fileDataUrl(text, mimeType);

  return {
    assetId: id,
    fileName,
    mimeType,
    url: downloadUrl,
    previewUrl: downloadUrl,
    downloadUrl
  };
}

export function createStaticAsset(
  id: string,
  fileName: string,
  path: string,
  mimeType?: string
): PublicAssetRef {
  const url = publicAssetUrl(path);

  return {
    assetId: id,
    fileName,
    mimeType,
    url,
    previewUrl: url,
    downloadUrl: url
  };
}

export function createExternalAsset(
  id: string,
  fileName: string,
  url: string,
  mimeType?: string
): PublicAssetRef {
  return {
    assetId: id,
    fileName,
    mimeType,
    url,
    previewUrl: url,
    downloadUrl: url
  };
}
