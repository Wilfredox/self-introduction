import {
  Asset,
  ApiProjectStatus,
  FeaturedProject,
  MockDatabase,
  Project,
  ProjectDetail,
  ProjectStatus,
  PublicAssetRef,
  PublicBootstrap,
  PublicProfile,
  PublicProjectImage,
  PublicProjectLink,
  PublicResumeAsset,
  ResumePageView
} from "../types/content";

const FALLBACK_IMAGE_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#efe4d3"/>
  <rect x="56" y="56" width="1088" height="788" rx="28" fill="#fcf8f2" stroke="#d8c9b4"/>
  <text x="600" y="430" text-anchor="middle" font-family="Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" font-size="44" fill="#8c795d">
    Portfolio Cover
  </text>
  <text x="600" y="500" text-anchor="middle" font-family="Segoe UI, PingFang SC, Microsoft YaHei, sans-serif" font-size="24" fill="#605a53">
    Waiting for uploaded image
  </text>
</svg>
`)}`;

type LegacyBootstrapPayload = {
  site: PublicProfile;
  projects: FeaturedProject[];
  resume?: PublicResumeAsset;
  contentVersion: string;
};

type BootstrapEnvelope = {
  success?: boolean;
  data: PublicBootstrap | LegacyBootstrapPayload;
};

type DetailEnvelope = {
  success?: boolean;
  data: ProjectDetail;
};

function sortLinks(links: PublicProjectLink[]) {
  return [...links].sort((left, right) => left.order - right.order);
}

function sortImages(images: PublicProjectImage[]) {
  return [...images].sort((left, right) => left.order - right.order);
}

export function normalizeProjectStatus(status: string | undefined): ProjectStatus {
  return String(status).toLowerCase() === "published" ? "published" : "draft";
}

export function toApiProjectStatus(status: ProjectStatus): ApiProjectStatus {
  return status === "published" ? "PUBLISHED" : "DRAFT";
}

export function ensurePublicAssetRef(
  asset: PublicAssetRef | null | undefined,
  fallbackLabel = "cover"
): PublicAssetRef {
  if (asset) {
    return {
      ...asset,
      previewUrl: asset.previewUrl || asset.url
    };
  }

  return {
    assetId: `placeholder-${fallbackLabel}`,
    fileName: `${fallbackLabel}.svg`,
    url: FALLBACK_IMAGE_URL,
    previewUrl: FALLBACK_IMAGE_URL
  };
}

export function toPublicAssetRef(asset: Asset | undefined, updatedAt?: string, includeDownload = false): PublicAssetRef | undefined {
  if (!asset) {
    return undefined;
  }

  return {
    assetId: asset.id,
    fileName: asset.fileName,
    url: asset.url,
    previewUrl: asset.previewUrl || asset.url,
    downloadUrl: includeDownload ? asset.url : undefined,
    updatedAt
  };
}

function mapPublicLinks(database: MockDatabase, projectId: string): PublicProjectLink[] {
  return database.projectLinks
    .filter((link) => link.projectId === projectId)
    .sort((left, right) => left.order - right.order)
    .map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      order: link.order
    }));
}

function mapPublicImages(database: MockDatabase, projectId: string): PublicProjectImage[] {
  return database.projectImages
    .filter((image) => image.projectId === projectId)
    .sort((left, right) => left.order - right.order)
    .map((image) => {
      const asset = database.assets.find((item) => item.id === image.assetId);

      return {
        id: image.id,
        assetId: image.assetId,
        caption: image.caption,
        order: image.order,
        fileName: asset?.fileName,
        url: asset?.url ?? "",
        previewUrl: asset?.previewUrl ?? asset?.url ?? ""
      };
    });
}

function mapFeaturedProject(database: MockDatabase, project: Project): FeaturedProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    period: project.period,
    status: normalizeProjectStatus(project.status),
    sortOrder: project.sortOrder,
    cover: toPublicAssetRef(
      database.assets.find((asset) => asset.id === project.coverAssetId),
      project.updatedAt
    ) as PublicAssetRef,
    links: mapPublicLinks(database, project.id),
    updatedAt: project.updatedAt
  };
}

export function mapDatabaseToPublicBootstrap(database: MockDatabase): PublicBootstrap {
  return {
    profile: {
      name: database.siteProfile.name,
      tagline: database.siteProfile.tagline,
      contacts: [...database.siteProfile.contacts].sort((left, right) => left.order - right.order)
    },
    featuredProjects: [...database.projects]
      .filter((project) => project.status === "published")
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((project) => mapFeaturedProject(database, project)),
    resume: mapDatabaseToPublicResumeAsset(database),
    contentVersion: database.contentVersion
  };
}

export function mapDatabaseToProjectDetail(database: MockDatabase, project: Project): ProjectDetail {
  const story = database.projectStories.find((item) => item.projectId === project.id);

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    description: story?.description || project.excerpt,
    period: project.period,
    status: normalizeProjectStatus(project.status),
    sortOrder: project.sortOrder,
    cover: toPublicAssetRef(
      database.assets.find((asset) => asset.id === project.coverAssetId),
      project.updatedAt
    ) as PublicAssetRef,
    pdf: toPublicAssetRef(
      database.assets.find((asset) => asset.id === project.pdfAssetId),
      project.updatedAt
    ),
    links: mapPublicLinks(database, project.id),
    images: mapPublicImages(database, project.id),
    role: story?.role?.trim() ? story.role.trim() : undefined,
    highlights: story?.highlights?.filter(Boolean).length ? story.highlights.filter(Boolean) : undefined,
    notes: story?.notes?.filter(Boolean).length ? story.notes.filter(Boolean) : undefined,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
}

export function mapDatabaseToPublicResumeAsset(database: MockDatabase): PublicResumeAsset | undefined {
  const asset = database.assets.find((item) => item.id === database.resumeMeta.resumeAssetId);

  if (!asset) {
    return undefined;
  }

  return {
    assetId: asset.id,
    fileName: asset.fileName,
    url: asset.url,
    previewUrl: asset.previewUrl || asset.url,
    downloadUrl: asset.url,
    updatedAt: database.contentVersion
  };
}

export function mapDatabaseToResumePageView(database: MockDatabase): ResumePageView {
  return {
    title: database.resumeMeta.title,
    summary: database.resumeMeta.summary,
    downloadLabel: database.resumeMeta.downloadLabel,
    asset: mapDatabaseToPublicResumeAsset(database)
  };
}

export function normalizeBootstrapPayload(payload: PublicBootstrap | LegacyBootstrapPayload | BootstrapEnvelope): PublicBootstrap {
  const data = "data" in payload ? payload.data : payload;

  if ("profile" in data) {
    return {
      profile: {
        name: data.profile.name,
        tagline: data.profile.tagline,
        contacts: [...data.profile.contacts].sort((left, right) => left.order - right.order)
      },
      featuredProjects: data.featuredProjects.map((project) => ({
        ...project,
        status: normalizeProjectStatus(project.status),
        cover: ensurePublicAssetRef(project.cover, project.slug),
        links: sortLinks(project.links)
      })),
      resume: data.resume ?? undefined,
      contentVersion: data.contentVersion
    };
  }

  return {
    profile: {
      name: data.site.name,
      tagline: data.site.tagline,
      contacts: [...data.site.contacts].sort((left, right) => left.order - right.order)
      },
      featuredProjects: data.projects.map((project) => ({
        ...project,
        status: normalizeProjectStatus(project.status),
        cover: ensurePublicAssetRef(project.cover, project.slug),
        links: sortLinks(project.links)
      })),
    resume: data.resume ?? undefined,
    contentVersion: data.contentVersion
  };
}

export function normalizeProjectDetailPayload(payload: ProjectDetail | DetailEnvelope): ProjectDetail {
  const data = "data" in payload ? payload.data : payload;

  return {
    ...data,
    status: normalizeProjectStatus(data.status),
    cover: ensurePublicAssetRef(data.cover, data.slug),
    pdf: data.pdf ?? undefined,
    links: sortLinks(data.links),
    images: sortImages(data.images).map((image) => ({
      ...image,
      caption: image.caption ?? ""
    })),
    role: data.role?.trim() ? data.role.trim() : undefined,
    highlights: data.highlights?.filter(Boolean).length ? data.highlights.filter(Boolean) : undefined,
    notes: data.notes?.filter(Boolean).length ? data.notes.filter(Boolean) : undefined
  };
}
