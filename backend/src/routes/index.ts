import { Router } from "express";
import { sendOk } from "../utils/api-response.js";
import { publicRouter } from "./public.routes.js";
import { adminAuthRouter } from "./admin-auth.routes.js";
import { adminSiteRouter } from "./admin-site.routes.js";
import { adminProjectRouter } from "./admin-project.routes.js";
import { adminAssetsRouter } from "./admin-assets.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  return sendOk(response, {
    status: "ok"
  });
});

apiRouter.use("/public", publicRouter);
apiRouter.use("/admin/auth", adminAuthRouter);
apiRouter.use("/admin", adminSiteRouter);
apiRouter.use("/admin", adminProjectRouter);
apiRouter.use("/admin", adminAssetsRouter);
