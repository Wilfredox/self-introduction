import { AssetKind, Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { assetsService } from "./assets.service.js";
import {
  getResolvedAssetUrls,
  mapAssetRefWithResolvedUrls,
  resolveAssetUrlMap,
  type ResolvedAssetUrlMap
} from "./storage/public-asset.js";

const siteProfileInclude = {
  contacts: {
    orderBy: {
      order: "asc"
    }
  },
  resumeAsset: true
} satisfies Prisma.SiteProfileInclude;

const publicProjectInclude = {
  coverAsset: true,
  links: {
    orderBy: {
      order: "asc"
    }
  }
} satisfies Prisma.ProjectInclude;

function mapContact(contact: { id: string; label: string; value: string; href: string; order: number }) {
  return {
    id: contact.id,
    label: contact.label,
    value: contact.value,
    href: contact.href,
    order: contact.order
  };
}

function mapPublicProject(
  project: Prisma.ProjectGetPayload<{ include: typeof publicProjectInclude }>,
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

async function ensureSiteProfile() {
  return prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Your Name",
      tagline: "Your one-line introduction"
    },
    include: siteProfileInclude
  });
}

async function getAdminSite() {
  const site = await ensureSiteProfile();
  const resolvedAssets = await resolveAssetUrlMap(site.resumeAsset ? [site.resumeAsset] : []);

  return {
    id: site.id,
    name: site.name,
    tagline: site.tagline,
    contacts: site.contacts.map(mapContact),
    resume:
      site.resumeAsset
        ? mapAssetRefWithResolvedUrls(site.resumeAsset, getResolvedAssetUrls(site.resumeAsset, resolvedAssets))
        : null,
    updatedAt: site.updatedAt.toISOString()
  };
}

async function getPublicResume() {
  const site = await ensureSiteProfile();
  const resolvedAssets = await resolveAssetUrlMap(site.resumeAsset ? [site.resumeAsset] : []);
  return site.resumeAsset
    ? mapAssetRefWithResolvedUrls(site.resumeAsset, getResolvedAssetUrls(site.resumeAsset, resolvedAssets))
    : null;
}

async function getPublicBootstrap() {
  const site = await ensureSiteProfile();
  const projects = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED
    },
    orderBy: {
      sortOrder: "asc"
    },
    include: publicProjectInclude
  });

  const timestamps = [
    site.updatedAt,
    site.resumeAsset?.updatedAt,
    ...projects.map((project) => project.updatedAt)
  ].filter((value): value is Date => Boolean(value));

  const latestTimestamp = timestamps.sort((left, right) => right.getTime() - left.getTime())[0];
  const resolvedAssets = await resolveAssetUrlMap([
    ...(site.resumeAsset ? [site.resumeAsset] : []),
    ...projects.flatMap((project) => (project.coverAsset ? [project.coverAsset] : []))
  ]);

  return {
    profile: {
      name: site.name,
      tagline: site.tagline,
      contacts: site.contacts.map(mapContact)
    },
    resume:
      site.resumeAsset
        ? mapAssetRefWithResolvedUrls(site.resumeAsset, getResolvedAssetUrls(site.resumeAsset, resolvedAssets))
        : null,
    featuredProjects: projects.map((project) => mapPublicProject(project, resolvedAssets)),
    contentVersion: latestTimestamp ? latestTimestamp.toISOString() : null
  };
}

async function updateSite(input: {
  name: string;
  tagline: string;
  contacts: Array<{ label: string; value: string; href: string; order: number }>;
}) {
  await ensureSiteProfile();

  const site = await prisma.siteProfile.update({
    where: { id: 1 },
    data: {
      name: input.name,
      tagline: input.tagline,
      contacts: {
        deleteMany: {},
        ...(input.contacts.length > 0
          ? {
              createMany: {
                data: input.contacts
              }
            }
          : {})
      }
    },
    include: siteProfileInclude
  });

  return {
    id: site.id,
    name: site.name,
    tagline: site.tagline,
    contacts: site.contacts.map(mapContact),
    resume:
      site.resumeAsset
        ? mapAssetRefWithResolvedUrls(
            site.resumeAsset,
            getResolvedAssetUrls(site.resumeAsset, await resolveAssetUrlMap([site.resumeAsset]))
          )
        : null,
    updatedAt: site.updatedAt.toISOString()
  };
}

async function replaceResume(assetId: string) {
  await assetsService.assertAssetKinds([{ id: assetId, kind: AssetKind.RESUME }]);
  await ensureSiteProfile();

  const site = await prisma.siteProfile.update({
    where: { id: 1 },
    data: {
      resumeAssetId: assetId
    },
    include: siteProfileInclude
  });

  return {
    id: site.id,
    name: site.name,
    tagline: site.tagline,
    contacts: site.contacts.map(mapContact),
    resume:
      site.resumeAsset
        ? mapAssetRefWithResolvedUrls(
            site.resumeAsset,
            getResolvedAssetUrls(site.resumeAsset, await resolveAssetUrlMap([site.resumeAsset]))
          )
        : null,
    updatedAt: site.updatedAt.toISOString()
  };
}

export const siteService = {
  getAdminSite,
  getPublicBootstrap,
  getPublicResume,
  replaceResume,
  updateSite
};
