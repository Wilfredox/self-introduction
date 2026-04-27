import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendOk } from "../utils/api-response.js";
import { requireAdminAuth } from "../middleware/require-admin-auth.js";
import { requireAdminOrigin } from "../middleware/require-admin-origin.js";
import { validateBody } from "../middleware/validate.js";
import { createProjectSchema, sortProjectsSchema, updateProjectSchema } from "../validators/project.js";
import { projectsService } from "../services/projects.service.js";

export const adminProjectRouter = Router();

adminProjectRouter.use(requireAdminAuth);
adminProjectRouter.use(requireAdminOrigin);

adminProjectRouter.get(
  "/projects",
  asyncHandler(async (_request, response) => {
    return sendOk(response, await projectsService.listAdminProjects());
  })
);

adminProjectRouter.post(
  "/projects",
  validateBody(createProjectSchema),
  asyncHandler(async (request, response) => {
    return sendOk(response, await projectsService.createProject(request.body), 201);
  })
);

adminProjectRouter.put(
  "/projects/sort",
  validateBody(sortProjectsSchema),
  asyncHandler(async (request, response) => {
    return sendOk(response, await projectsService.sortProjects(request.body.projectIds));
  })
);

adminProjectRouter.get(
  "/projects/:id",
  asyncHandler(async (request, response) => {
    const projectId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    return sendOk(response, await projectsService.getAdminProjectById(projectId));
  })
);

adminProjectRouter.patch(
  "/projects/:id",
  validateBody(updateProjectSchema),
  asyncHandler(async (request, response) => {
    const projectId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    return sendOk(response, await projectsService.updateProject(projectId, request.body));
  })
);

adminProjectRouter.delete(
  "/projects/:id",
  asyncHandler(async (request, response) => {
    const projectId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    await projectsService.deleteProject(projectId);
    return sendOk(response, { deleted: true });
  })
);
