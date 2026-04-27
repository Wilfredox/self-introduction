import {
  AdminAssetUploadResult,
  AdminProjectPayload,
  AdminSession,
  AdminSiteInput,
  AdminSiteRecord,
  FeaturedProject,
  ProjectDetail,
  PublicBootstrap,
  PublicProjectLink,
  PublicResumeAsset
} from "../types/content";
import {
  ensurePublicAssetRef,
  normalizeBootstrapPayload,
  normalizeProjectDetailPayload,
  normalizeProjectStatus
} from "./publicAdapters";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || "/api").replace(/\/$/, "");

interface ApiEnvelope<T> {
  success?: boolean;
  data: T;
  error?: {
    code?: string;
    message?: string;
  };
}

interface AdminAuthResponse {
  admin: {
    id: string;
    username: string;
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function sortLinks(links: PublicProjectLink[]) {
  return [...links].sort((left, right) => left.order - right.order);
}

function normalizeFeaturedProject(project: FeaturedProject): FeaturedProject {
  return {
    ...project,
    status: normalizeProjectStatus(project.status),
    cover: ensurePublicAssetRef(project.cover, project.slug),
    links: sortLinks(project.links)
  };
}

function normalizePublicResumeAsset(asset: PublicResumeAsset | null | undefined) {
  if (!asset) {
    return null;
  }

  return {
    ...asset,
    previewUrl: asset.previewUrl || asset.url,
    downloadUrl: asset.downloadUrl || asset.url
  };
}

function normalizeAdminSite(site: AdminSiteRecord): AdminSiteRecord {
  return {
    ...site,
    contacts: [...site.contacts].sort((left, right) => left.order - right.order),
    resume: normalizePublicResumeAsset(site.resume)
  };
}

function mapAdminSession(data: AdminAuthResponse): AdminSession {
  return {
    id: data.admin.id,
    username: data.admin.username
  };
}

async function parseResponse<T>(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("接口返回了无法解析的内容。", response.status || 500, "INVALID_JSON_RESPONSE");
  }
}

async function request<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const isFormData = init.body instanceof FormData;

  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "include"
    });
  } catch {
    throw new ApiError("无法连接到后端接口，请确认本地服务已启动。", 0, "NETWORK_ERROR");
  }

  const payload = await parseResponse<T>(response);

  if (!response.ok || !payload?.success) {
    const message =
      payload?.error?.message ||
      (response.status === 401 ? "登录状态已失效，请重新登录。" : `请求失败（${response.status}）。`);
    throw new ApiError(message, response.status, payload?.error?.code);
  }

  return payload.data;
}

function createFileFormData(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

export const realApi = {
  async getPublicBootstrap(): Promise<PublicBootstrap> {
    const data = await request<PublicBootstrap>("/public/bootstrap");
    return normalizeBootstrapPayload(data);
  },

  async getPublicProjects(): Promise<FeaturedProject[]> {
    const data = await request<FeaturedProject[]>("/public/projects");
    return data.map(normalizeFeaturedProject);
  },

  async getPublicProject(slug: string): Promise<ProjectDetail | null> {
    try {
      const data = await request<ProjectDetail>(`/public/projects/${slug}`);
      return normalizeProjectDetailPayload(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  },

  async getPublicResume(): Promise<PublicResumeAsset | null> {
    const data = await request<PublicResumeAsset | null>("/public/resume");
    return normalizePublicResumeAsset(data);
  },

  async login(username: string, password: string): Promise<AdminSession> {
    const data = await request<AdminAuthResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    });

    return mapAdminSession(data);
  },

  async getAdminSession(): Promise<AdminSession | null> {
    try {
      const data = await request<AdminAuthResponse>("/admin/auth/me");
      return mapAdminSession(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },

  async logout() {
    await request("/admin/auth/logout", {
      method: "POST"
    });
  },

  async getAdminSite(): Promise<AdminSiteRecord> {
    const data = await request<AdminSiteRecord>("/admin/site");
    return normalizeAdminSite(data);
  },

  async updateAdminSite(payload: AdminSiteInput): Promise<AdminSiteRecord> {
    const data = await request<AdminSiteRecord>("/admin/site", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    return normalizeAdminSite(data);
  },

  async getAdminProjects(): Promise<ProjectDetail[]> {
    const data = await request<ProjectDetail[]>("/admin/projects");
    return data.map((project) => normalizeProjectDetailPayload(project));
  },

  async createProject(payload: AdminProjectPayload): Promise<ProjectDetail> {
    const data = await request<ProjectDetail>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    return normalizeProjectDetailPayload(data);
  },

  async updateProject(projectId: string, payload: AdminProjectPayload): Promise<ProjectDetail> {
    const data = await request<ProjectDetail>(`/admin/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    return normalizeProjectDetailPayload(data);
  },

  async deleteProject(projectId: string) {
    await request(`/admin/projects/${projectId}`, {
      method: "DELETE"
    });
  },

  async reorderProjects(projectIds: string[]): Promise<ProjectDetail[]> {
    const data = await request<ProjectDetail[]>("/admin/projects/sort", {
      method: "PUT",
      body: JSON.stringify({ projectIds })
    });

    return data.map((project) => normalizeProjectDetailPayload(project));
  },

  async uploadImage(file: File): Promise<AdminAssetUploadResult> {
    return request<AdminAssetUploadResult>("/admin/assets/images", {
      method: "POST",
      body: createFileFormData(file)
    });
  },

  async uploadProjectPdf(file: File): Promise<AdminAssetUploadResult> {
    return request<AdminAssetUploadResult>("/admin/assets/pdfs", {
      method: "POST",
      body: createFileFormData(file)
    });
  },

  async uploadResume(file: File): Promise<AdminSiteRecord> {
    const data = await request<AdminSiteRecord>("/admin/resume", {
      method: "PUT",
      body: createFileFormData(file)
    });

    return normalizeAdminSite(data);
  }
};
