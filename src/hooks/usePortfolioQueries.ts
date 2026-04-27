import { useQuery } from "@tanstack/react-query";
import { realApi } from "../data/realApi";

export const queryKeys = {
  bootstrap: ["public", "bootstrap"] as const,
  projects: ["public", "projects"] as const,
  projectDetail: (slug: string) => ["public", "projects", slug] as const,
  resume: ["public", "resume"] as const,
  adminSession: ["admin", "session"] as const,
  adminSite: ["admin", "site"] as const,
  adminProjects: ["admin", "projects"] as const,
  adminResume: ["admin", "resume"] as const
};

export function useBootstrapQuery() {
  return useQuery({
    queryKey: queryKeys.bootstrap,
    queryFn: () => realApi.getPublicBootstrap()
  });
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => realApi.getPublicProjects()
  });
}

export function useProjectDetailQuery(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.projectDetail(slug ?? "missing"),
    queryFn: () => realApi.getPublicProject(slug ?? ""),
    enabled: Boolean(slug)
  });
}

export function useResumeQuery() {
  return useQuery({
    queryKey: queryKeys.resume,
    queryFn: () => realApi.getPublicResume()
  });
}

export function useAdminSessionQuery() {
  return useQuery({
    queryKey: queryKeys.adminSession,
    queryFn: () => realApi.getAdminSession(),
    retry: false
  });
}

export function useAdminSiteQuery() {
  return useQuery({
    queryKey: queryKeys.adminSite,
    queryFn: () => realApi.getAdminSite()
  });
}

export function useAdminProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.adminProjects,
    queryFn: () => realApi.getAdminProjects()
  });
}
