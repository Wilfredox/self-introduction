export type AssetKind = "image" | "pdf";
export type ProjectStatus = "draft" | "published";
export type ApiProjectStatus = "DRAFT" | "PUBLISHED";
export type AccentTone = "olive" | "rust" | "slate" | "charcoal" | "marine" | "sand";

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  href: string;
  order: number;
}

export interface SiteProfile {
  name: string;
  tagline: string;
  contacts: ContactItem[];
  resumeAssetId: string;
}

export interface Asset {
  id: string;
  kind: AssetKind;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  previewUrl: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  coverAssetId: string;
  pdfAssetId: string | null;
  sortOrder: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLink {
  id: string;
  projectId: string;
  label: string;
  url: string;
  order: number;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  assetId: string;
  caption: string;
  order: number;
}

export interface ProjectStory {
  projectId: string;
  description: string;
  role?: string;
  highlights?: string[];
  notes?: string[];
}

export interface ResumeMeta {
  title: string;
  summary: string;
  downloadLabel: string;
  resumeAssetId: string;
}

export interface MockDatabase {
  contentVersion: string;
  siteProfile: SiteProfile;
  resumeMeta: ResumeMeta;
  assets: Asset[];
  projects: Project[];
  projectLinks: ProjectLink[];
  projectImages: ProjectImage[];
  projectStories: ProjectStory[];
}

export interface PublicProfile {
  name: string;
  tagline: string;
  contacts: ContactItem[];
}

export interface PublicAssetRef {
  assetId: string;
  fileName?: string;
  url: string;
  previewUrl: string;
  downloadUrl?: string;
  updatedAt?: string;
}

export interface PublicProjectLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

export interface PublicProjectImage {
  id: string;
  assetId: string;
  caption: string;
  order: number;
  fileName?: string;
  url: string;
  previewUrl: string;
}

export interface FeaturedProject {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  status: ProjectStatus;
  sortOrder: number;
  cover: PublicAssetRef;
  links: PublicProjectLink[];
  updatedAt: string;
}

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  period: string;
  status: ProjectStatus;
  sortOrder: number;
  cover: PublicAssetRef;
  pdf?: PublicAssetRef | null;
  links: PublicProjectLink[];
  images: PublicProjectImage[];
  role?: string;
  highlights?: string[];
  notes?: string[];
  createdAt: string;
  updatedAt: string;
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
  contentVersion: string | null;
}

export interface ResumePageView {
  title: string;
  summary: string;
  downloadLabel: string;
  asset?: PublicResumeAsset;
}

export interface AdminSession {
  id: string;
  username: string;
  loginAt?: string;
  email?: string;
}

export interface AdminSitePayload {
  profile: SiteProfile;
}

export interface AdminResumePayload {
  title: string;
  summary: string;
  downloadLabel: string;
}

export interface AdminProjectInput {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  status: ProjectStatus;
  description: string;
  role?: string;
  highlights?: string[];
  notes?: string[];
  links: Array<Pick<ProjectLink, "id" | "label" | "url" | "order">>;
  images: Array<Pick<ProjectImage, "id" | "caption" | "order">>;
}

export interface AdminSiteRecord {
  id: number;
  name: string;
  tagline: string;
  contacts: ContactItem[];
  resume: PublicResumeAsset | null;
  updatedAt: string;
}

export interface AdminSiteInput {
  name: string;
  tagline: string;
  contacts: Array<Pick<ContactItem, "label" | "value" | "href" | "order">>;
}

export interface AdminAssetUploadResult {
  id: string;
  kind: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  previewUrl: string;
}

export interface AdminProjectPayload {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  period: string;
  role?: string | null;
  highlights: string[];
  notes: string[];
  coverAssetId?: string | null;
  pdfAssetId?: string | null;
  status: ApiProjectStatus;
  images: Array<{
    assetId: string;
    caption: string | null;
    order: number;
  }>;
  links: Array<{
    label: string;
    url: string;
    order: number;
  }>;
}
