import { portfolioProjects } from "../content/projects";
import { resumeContent, siteContentVersion, siteProfile } from "../content/site";
import { FeaturedProject, ProjectDetail, PublicBootstrap, ResumeContent } from "../types/content";

const homeFeaturedProjectOrder = [
  "water-daily",
  "xaj-model",
  "mike11-network",
  "design-flood",
  "mike21-calibration",
  "arcgis-irrigation",
  "villa-bim",
  "guizhou-cad",
  "linlan-desktop-pet",
  "dam-bim"
];

const homeFeaturedProjectRank = new Map(homeFeaturedProjectOrder.map((id, index) => [id, index]));

const featuredProjects: FeaturedProject[] = portfolioProjects
  .filter((project) => project.featuredOnHome)
  .sort((a, b) => {
    const aRank = homeFeaturedProjectRank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bRank = homeFeaturedProjectRank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  })
  .map(({ cover, excerpt, id, links, period, slug, title }) => ({
    id,
    slug,
    title,
    excerpt,
    period,
    cover,
    links
  }));

const bootstrap: PublicBootstrap = {
  profile: siteProfile,
  featuredProjects,
  resume: resumeContent.asset ?? null,
  contentVersion: siteContentVersion
};

export function getPortfolioBootstrap(): PublicBootstrap {
  return bootstrap;
}

export function getPortfolioProjects(): ProjectDetail[] {
  return portfolioProjects;
}

export function getPortfolioProject(slug: string | undefined): ProjectDetail | null {
  if (!slug) {
    return null;
  }

  return portfolioProjects.find((project) => project.slug === slug) ?? null;
}

export function getResumeContent(): ResumeContent {
  return resumeContent;
}
