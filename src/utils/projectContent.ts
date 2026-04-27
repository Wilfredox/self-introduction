import { AccentTone, PublicProjectLink } from "../types/content";

const TONES: AccentTone[] = ["olive", "rust", "slate", "charcoal", "marine", "sand"];

export function getPrimaryProjectLink(links: PublicProjectLink[] | undefined) {
  return links?.[0];
}

export function formatExternalUrl(url: string | undefined) {
  return url ? url.replace(/^https?:\/\//, "") : "待补充";
}

export function getProjectTone(seed: string | number) {
  const text = String(seed);
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return TONES[hash % TONES.length];
}
