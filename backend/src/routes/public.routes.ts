import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendOk } from "../utils/api-response.js";
import { siteService } from "../services/site.service.js";
import { projectsService } from "../services/projects.service.js";

export const publicRouter = Router();

publicRouter.get(
  "/bootstrap",
  asyncHandler(async (_request, response) => {
    return sendOk(response, await siteService.getPublicBootstrap());
  })
);

publicRouter.get(
  "/projects",
  asyncHandler(async (_request, response) => {
    return sendOk(response, await projectsService.listPublicProjects());
  })
);

publicRouter.get(
  "/projects/:slug",
  asyncHandler(async (request, response) => {
    const slug = Array.isArray(request.params.slug) ? request.params.slug[0] : request.params.slug;
    return sendOk(response, await projectsService.getPublicProjectBySlug(slug));
  })
);

publicRouter.get(
  "/resume",
  asyncHandler(async (_request, response) => {
    return sendOk(response, await siteService.getPublicResume());
  })
);
