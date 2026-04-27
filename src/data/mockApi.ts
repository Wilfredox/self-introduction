import {
  AdminProjectInput,
  AdminResumePayload,
  AdminSession,
  AdminSitePayload,
  FeaturedProject,
  MockDatabase,
  Project
} from "../types/content";
import { moveItem } from "../utils/array";
import { clearSession, readDatabase, readSession, updateDatabase, writeSession } from "./mockDb";
import { createImageAsset, createPdfAsset } from "./mockSeed";
import {
  mapDatabaseToProjectDetail,
  mapDatabaseToPublicBootstrap,
  mapDatabaseToResumePageView
} from "./publicAdapters";

function wait(ms = 140) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getPublishedProjects(database: MockDatabase) {
  return database.projects
    .filter((project) => project.status === "published")
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function getSortedProjects(database: MockDatabase) {
  return [...database.projects].sort((left, right) => left.sortOrder - right.sortOrder);
}

function makeProjectId() {
  return `project-${Math.random().toString(36).slice(2, 9)}`;
}

function toPublicProjects(database: MockDatabase): FeaturedProject[] {
  return mapDatabaseToPublicBootstrap(database).featuredProjects;
}

export const mockApi = {
  async getPublicBootstrap() {
    await wait();
    const database = readDatabase();
    return mapDatabaseToPublicBootstrap(database);
  },

  async getPublicProjects() {
    await wait();
    const database = readDatabase();
    return toPublicProjects(database);
  },

  async getPublicProject(slug: string) {
    await wait();
    const database = readDatabase();
    const publishedProjects = getPublishedProjects(database);
    const index = publishedProjects.findIndex((project) => project.slug === slug);

    if (index < 0) {
      return null;
    }

    return mapDatabaseToProjectDetail(database, publishedProjects[index]);
  },

  async getPublicResume() {
    await wait();
    const database = readDatabase();
    return mapDatabaseToResumePageView(database);
  },

  async getAdminSession() {
    await wait(60);
    return readSession();
  },

  async login(email: string, password: string) {
    await wait(120);

    if (!email.trim() || !password.trim()) {
      throw new Error("请填写邮箱和密码。");
    }

    const session: AdminSession = {
      id: "mock-admin",
      username: "mock-admin",
      email,
      loginAt: new Date().toISOString()
    };
    writeSession(session);
    return session;
  },

  async logout() {
    await wait(60);
    clearSession();
  },

  async getAdminSite() {
    await wait();
    const database = readDatabase();
    return { profile: database.siteProfile };
  },

  async updateAdminSite(payload: AdminSitePayload) {
    await wait();
    const database = updateDatabase((draft) => ({
      ...draft,
      siteProfile: {
        ...payload.profile,
        contacts: [...payload.profile.contacts].sort((left, right) => left.order - right.order)
      }
    }));

    return { profile: database.siteProfile };
  },

  async getAdminProjects() {
    await wait();
    const database = readDatabase();
    return getSortedProjects(database).map((project) => mapDatabaseToProjectDetail(database, project));
  },

  async createProject() {
    await wait();
    const database = updateDatabase((draft) => {
      const nextId = makeProjectId();
      const sortOrder = draft.projects.length + 1;
      const coverAssetId = `${nextId}-cover`;
      const pdfAssetId = `${nextId}-pdf`;

      draft.assets.push(createImageAsset(coverAssetId, "未命名作品", "请补充摘要与封面", "sand", "草稿项目"));

      draft.assets.push(createPdfAsset(pdfAssetId, `${nextId}.pdf`));

      draft.projects.push({
        id: nextId,
        slug: `${nextId}-slug`,
        title: "未命名作品",
        excerpt: "请在后台补充这条作品的摘要。",
        period: "2026.04 - 2026.04",
        coverAssetId,
        pdfAssetId,
        sortOrder,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      draft.projectStories.push({
        projectId: nextId,
        description: "待补充项目背景、方法和结果。",
        role: "待补充角色",
        highlights: ["待补充亮点 1"],
        notes: ["待补充说明 1"]
      });

      return draft;
    });

    const projects = getSortedProjects(database);
    return mapDatabaseToProjectDetail(database, projects[projects.length - 1]);
  },

  async updateProject(payload: AdminProjectInput) {
    await wait();

    const database = updateDatabase((draft) => {
      const projectIndex = draft.projects.findIndex((project) => project.id === payload.id);

      if (projectIndex < 0) {
        return draft;
      }

      const current = draft.projects[projectIndex];
      draft.projects[projectIndex] = {
        ...current,
        slug: payload.slug,
        title: payload.title,
        excerpt: payload.excerpt,
        period: payload.period,
        status: payload.status,
        updatedAt: new Date().toISOString()
      };

      const storyIndex = draft.projectStories.findIndex((story) => story.projectId === current.id);
      if (storyIndex >= 0) {
        draft.projectStories[storyIndex] = {
          projectId: current.id,
          description: payload.description,
          role: payload.role?.trim() || undefined,
          highlights: payload.highlights?.filter(Boolean),
          notes: payload.notes?.filter(Boolean)
        };
      } else {
        draft.projectStories.push({
          projectId: current.id,
          description: payload.description,
          role: payload.role?.trim() || undefined,
          highlights: payload.highlights?.filter(Boolean),
          notes: payload.notes?.filter(Boolean)
        });
      }

      draft.projectLinks = draft.projectLinks
        .filter((link) => link.projectId !== current.id)
        .concat(
          payload.links
            .filter((link) => link.label.trim() && link.url.trim())
            .map((link, index) => ({
              id: link.id || `${current.id}-link-${index + 1}`,
              projectId: current.id,
              label: link.label.trim(),
              url: link.url.trim(),
              order: index + 1
            }))
        );

      draft.projectImages = draft.projectImages.map((image) => {
        if (image.projectId !== current.id) {
          return image;
        }

        const updated = payload.images.find((item) => item.id === image.id);
        return updated
          ? {
              ...image,
              caption: updated.caption,
              order: updated.order
            }
          : image;
      });

      return draft;
    });

    const projects = getSortedProjects(database);
    const index = projects.findIndex((project) => project.id === payload.id);
    return mapDatabaseToProjectDetail(database, projects[index]);
  },

  async reorderProjects(projectIds: string[]) {
    await wait();
    const database = updateDatabase((draft) => {
      draft.projects = projectIds
        .map((id) => draft.projects.find((project) => project.id === id))
        .filter(Boolean)
        .map((project, index) => ({
          ...(project as Project),
          sortOrder: index + 1,
          updatedAt: new Date().toISOString()
        }));

      return draft;
    });

    return getSortedProjects(database).map((project) => mapDatabaseToProjectDetail(database, project));
  },

  async moveProject(projectId: string, direction: "up" | "down") {
    await wait();
    const database = updateDatabase((draft) => {
      const sorted = getSortedProjects(draft);
      const currentIndex = sorted.findIndex((project) => project.id === projectId);

      if (currentIndex < 0) {
        return draft;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= sorted.length) {
        return draft;
      }

      const reordered = moveItem(sorted, currentIndex, targetIndex).map((project, index) => ({
        ...project,
        sortOrder: index + 1,
        updatedAt: new Date().toISOString()
      }));

      draft.projects = reordered;
      return draft;
    });

    return getSortedProjects(database).map((project) => mapDatabaseToProjectDetail(database, project));
  },

  async getAdminResume() {
    await wait();
    const database = readDatabase();
    return mapDatabaseToResumePageView(database);
  },

  async updateAdminResume(payload: AdminResumePayload) {
    await wait();
    const database = updateDatabase((draft) => ({
      ...draft,
      resumeMeta: {
        ...draft.resumeMeta,
        title: payload.title,
        summary: payload.summary,
        downloadLabel: payload.downloadLabel
      }
    }));

    return mapDatabaseToResumePageView(database);
  }
};
