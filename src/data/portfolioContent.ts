import { portfolioProjects } from "../content/projects";
import { resumeContent, siteContentVersion, siteProfile } from "../content/site";
import { FeaturedProject, ProjectDetail, PublicBootstrap, ResumeContent } from "../types/content";

const featuredProjects: FeaturedProject[] = portfolioProjects
  .filter((project) => project.featuredOnHome)
  .slice(0, 6)
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
