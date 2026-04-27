import { AssetKind, Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { assetsService } from "./assets.service.js";
import {
  getResolvedAssetUrls,
  resolveAssetUrlMap,
  type ResolvedAssetUrlMap
} from "./storage/public-asset.js";
import { AppError } from "../utils/errors.js";
import { normalizeSlug } from "../utils/slug.js";

const projectAdminInclude = {
  coverAsset: true,
  pdfAsset: true,
  images: {
    include: {
      asset: true
    },
    orderBy: {
      order: "asc"
    }
  },
  links: {
    orderBy: {
      order: "asc"
    }
  }
} satisfies Prisma.ProjectInclude;

const projectPublicInclude = projectAdminInclude;

function toStoredStringList(values: string[]): Prisma.InputJsonValue {
  return values;
}

function readStoredStringList(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function assertProjectCanBePublished(input: { status: ProjectStatus; coverAssetId?: string | null }) {
  if (input.status === ProjectStatus.PUBLISHED && !input.coverAssetId) {
    throw new AppError(400, "Published projects must include a cover image", "PUBLISHED_PROJECT_REQUIRES_COVER");
  }
}

function mapProjectSummary(
  project: Prisma.ProjectGetPayload<{ include: typeof projectPublicInclude }>,
  resolvedAssets: ResolvedAssetUrlMap
) {
  const coverAsset = project.coverAsset ? getResolvedAssetUrls(project.coverAsset, resolvedAssets) : null;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    period: project.period,
    status: project.status,
    sortOrder: project.sortOrder,
    cover: project.coverAsset && coverAsset
      ? {
          assetId: project.coverAsset.id,
          url: coverAsset.url,
          previewUrl: coverAsset.previewUrl
        }
      : null,
    links: project.links.map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      order: link.order
    })),
    updatedAt: project.updatedAt.toISOString()
  };
}

function mapProjectDetail(
  project: Prisma.ProjectGetPayload<{ include: typeof projectAdminInclude }>,
  resolvedAssets: ResolvedAssetUrlMap
) {
  const pdfAsset = project.pdfAsset ? getResolvedAssetUrls(project.pdfAsset, resolvedAssets) : null;

  return {
    ...mapProjectSummary(project, resolvedAssets),
    description: project.description,
    role: project.role ?? null,
    highlights: readStoredStringList(project.highlights),
    notes: readStoredStringList(project.notes),
    pdf: project.pdfAsset && pdfAsset
      ? {
          assetId: project.pdfAsset.id,
          fileName: project.pdfAsset.fileName,
          url: pdfAsset.url,
          previewUrl: pdfAsset.previewUrl
        }
      : null,
    images: project.images.map((image) => {
      const resolvedAsset = getResolvedAssetUrls(image.asset, resolvedAssets);

      return {
        id: image.id,
        assetId: image.asset.id,
        caption: image.caption,
        order: image.order,
        url: resolvedAsset.url,
        previewUrl: resolvedAsset.previewUrl
      };
    }),
    createdAt: project.createdAt.toISOString()
  };
}

function buildAssetAssertions(input: {
  coverAssetId?: string | null;
  pdfAssetId?: string | null;
  images?: Array<{ assetId: string }>;
}) {
  const checks: Array<{ id: string; kind: AssetKind }> = [];

  if (input.coverAssetId) {
    checks.push({ id: input.coverAssetId, kind: AssetKind.IMAGE });
  }

  if (input.pdfAssetId) {
    checks.push({ id: input.pdfAssetId, kind: AssetKind.PROJECT_PDF });
  }

  for (const image of input.images ?? []) {
    checks.push({ id: image.assetId, kind: AssetKind.IMAGE });
  }

  return checks;
}

function buildReplaceRelationData<T>(items: T[] | undefined) {
  if (!items) {
    return undefined;
  }

  if (items.length === 0) {
    return {
      deleteMany: {}
    };
  }

  return {
    deleteMany: {},
    createMany: {
      data: items
    }
  };
}

async function listPublicProjects() {
  const projects = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED
    },
    orderBy: {
      sortOrder: "asc"
    },
    include: projectPublicInclude
  });

  const resolvedAssets = await resolveAssetUrlMap(
    projects.flatMap((project) => (project.coverAsset ? [project.coverAsset] : []))
  );

  return projects.map((project) => mapProjectSummary(project, resolvedAssets));
}

async function getPublicProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      status: ProjectStatus.PUBLISHED
    },
    include: projectPublicInclude
  });

  if (!project) {
    throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
  }

  const resolvedAssets = await resolveAssetUrlMap([
    ...(project.coverAsset ? [project.coverAsset] : []),
    ...(project.pdfAsset ? [project.pdfAsset] : []),
    ...project.images.map((image) => image.asset)
  ]);

  return mapProjectDetail(project, resolvedAssets);
}

async function listAdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: {
      sortOrder: "asc"
    },
    include: projectAdminInclude
  });

  const resolvedAssets = await resolveAssetUrlMap(
    projects.flatMap((project) => [
      ...(project.coverAsset ? [project.coverAsset] : []),
      ...(project.pdfAsset ? [project.pdfAsset] : []),
      ...project.images.map((image) => image.asset)
    ])
  );

  return projects.map((project) => mapProjectDetail(project, resolvedAssets));
}

async function getAdminProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: projectAdminInclude
  });

  if (!project) {
    throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
  }

  const resolvedAssets = await resolveAssetUrlMap([
    ...(project.coverAsset ? [project.coverAsset] : []),
    ...(project.pdfAsset ? [project.pdfAsset] : []),
    ...project.images.map((image) => image.asset)
  ]);

  return mapProjectDetail(project, resolvedAssets);
}

async function createProject(input: {
  title: string;
  slug?: string;
  excerpt: string;
  description: string;
  period: string;
  role?: string | null;
  highlights: string[];
  notes: string[];
  coverAssetId?: string | null;
  pdfAssetId?: string | null;
  status: ProjectStatus;
  images: Array<{ assetId: string; caption: string | null; order: number }>;
  links: Array<{ label: string; url: string; order: number }>;
  sortOrder?: number;
}) {
  const slug = normalizeSlug(input.slug ?? input.title);

  if (!slug) {
    throw new AppError(400, "Could not build a valid slug from title", "INVALID_SLUG");
  }

  assertProjectCanBePublished(input);
  await assetsService.assertAssetKinds(buildAssetAssertions(input));

  const maxSortOrder = await prisma.project.aggregate({
    _max: {
      sortOrder: true
    }
  });

  const project = await prisma.project.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt,
      description: input.description,
      period: input.period,
      role: input.role ?? null,
      highlights: toStoredStringList(input.highlights),
      notes: toStoredStringList(input.notes),
      coverAssetId: input.coverAssetId ?? null,
      pdfAssetId: input.pdfAssetId ?? null,
      status: input.status,
      sortOrder: input.sortOrder ?? (maxSortOrder._max.sortOrder ?? 0) + 100,
      images:
        input.images.length > 0
          ? {
              createMany: {
                data: input.images
              }
            }
          : undefined,
      links:
        input.links.length > 0
          ? {
              createMany: {
                data: input.links
              }
            }
          : undefined
    },
    include: projectAdminInclude
  });

  const resolvedAssets = await resolveAssetUrlMap([
    ...(project.coverAsset ? [project.coverAsset] : []),
    ...(project.pdfAsset ? [project.pdfAsset] : []),
    ...project.images.map((image) => image.asset)
  ]);

  return mapProjectDetail(project, resolvedAssets);
}

async function updateProject(
  id: string,
  input: {
    title?: string;
    slug?: string;
    excerpt?: string;
    description?: string;
    period?: string;
    role?: string | null;
    highlights?: string[];
    notes?: string[];
    coverAssetId?: string | null;
    pdfAssetId?: string | null;
    status?: ProjectStatus;
    images?: Array<{ assetId: string; caption: string | null; order: number }>;
    links?: Array<{ label: string; url: string; order: number }>;
  }
) {
  const existingProject = await prisma.project.findUnique({
    where: { id }
  });

  if (!existingProject) {
    throw new AppError(404, "Project not found", "PROJECT_NOT_FOUND");
  }

  const normalizedSlug = input.slug !== undefined ? normalizeSlug(input.slug) : undefined;
  if (input.slug !== undefined && !normalizedSlug) {
    throw new AppError(400, "slug is invalid after normalization", "INVALID_SLUG");
  }

  assertProjectCanBePublished({
    status: input.status ?? existingProject.status,
    coverAssetId: input.coverAssetId !== undefined ? input.coverAssetId : existingProject.coverAssetId
  });
  await assetsService.assertAssetKinds(buildAssetAssertions(input));

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: input.title,
      slug: normalizedSlug,
      excerpt: input.excerpt,
      description: input.description,
      period: input.period,
      role: input.role,
      highlights: input.highlights !== undefined ? toStoredStringList(input.highlights) : undefined,
      notes: input.notes !== undefined ? toStoredStringList(input.notes) : undefined,
      coverAssetId: input.coverAssetId,
      pdfAssetId: input.pdfAssetId,
      status: input.status,
      images: buildReplaceRelationData(input.images),
      links: buildReplaceRelationData(input.links)
    },
    include: projectAdminInclude
  });

  const resolvedAssets = await resolveAssetUrlMap([
    ...(project.coverAsset ? [project.coverAsset] : []),
    ...(project.pdfAsset ? [project.pdfAsset] : []),
    ...project.images.map((image) => image.asset)
  ]);

  return mapProjectDetail(project, resolvedAssets);
}

async function deleteProject(id: string) {
  await getAdminProjectById(id);

  await prisma.project.delete({
    where: { id }
  });
}

async function sortProjects(projectIds: string[]) {
  const projects = await prisma.project.findMany({
    where: {
      id: { in: projectIds }
    },
    select: {
      id: true
    }
  });

  if (projects.length !== projectIds.length) {
    throw new AppError(400, "projectIds contains invalid ids", "INVALID_PROJECT_IDS");
  }

  await prisma.$transaction(
    projectIds.map((projectId, index) =>
      prisma.project.update({
        where: { id: projectId },
        data: {
          sortOrder: (index + 1) * 100
        }
      })
    )
  );

  return listAdminProjects();
}

export const projectsService = {
  createProject,
  deleteProject,
  getAdminProjectById,
  getPublicProjectBySlug,
  listAdminProjects,
  listPublicProjects,
  sortProjects,
  updateProject
};
