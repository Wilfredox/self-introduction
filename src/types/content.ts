export type AccentTone = "olive" | "rust" | "slate" | "charcoal" | "marine" | "sand";

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  href: string;
}

export interface PublicProfile {
  name: string;
  tagline: string;
  contacts: ContactItem[];
}

export interface PublicAssetRef {
  assetId: string;
  fileName?: string;
  mimeType?: string;
  url: string;
  previewUrl: string;
  downloadUrl?: string;
  updatedAt?: string;
}

export interface PublicProjectLink {
  id: string;
  label: string;
  url: string;
}

export interface PublicProjectImage {
  id: string;
  assetId: string;
  fileName?: string;
  url: string;
  previewUrl: string;
  caption: string;
}

export interface FeaturedProject {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  cover: PublicAssetRef;
  links: PublicProjectLink[];
}

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  period: string;
  cover: PublicAssetRef;
  pdf?: PublicAssetRef | null;
  downloadAsset?: PublicAssetRef | null;
  downloadLabel?: string;
  links: PublicProjectLink[];
  images: PublicProjectImage[];
  role?: string;
  highlights?: string[];
  notes?: string[];
}

export interface PublicResumeAsset {
  assetId: string;
  fileName: string;
  url: string;
  previewUrl: string;
  downloadUrl: string;
  updatedAt: string;
}

export interface PublicBootstrap {
  profile: PublicProfile;
  featuredProjects: FeaturedProject[];
  resume?: PublicResumeAsset | null;
  contentVersion: string;
}

export interface ResumeContent {
  title: string;
  summary: string;
  downloadLabel: string;
  asset?: PublicResumeAsset | null;
}
