import fs from "node:fs";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { apiRouter } from "./routes/index.js";

export const app = express();
const frontendIndexPath = path.join(env.frontendDistDir, "index.html");
const shouldServeFrontendFromBackend = env.serveFrontendFromBackend && fs.existsSync(frontendIndexPath);

if (env.trustProxy) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.adminAppOrigins.length === 0 || env.adminAppOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.storageProvider === "local") {
  app.use("/uploads", express.static(env.uploadRootDir));
}

app.use("/api", apiRouter);

if (shouldServeFrontendFromBackend) {
  app.use(express.static(env.frontendDistDir));
  app.get("*", (request, response, next) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      next();
      return;
    }

    if (request.path.startsWith("/api") || request.path.startsWith("/uploads")) {
      next();
      return;
    }

    response.sendFile(frontendIndexPath);
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
