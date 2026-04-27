import "dotenv/config";

import path from "node:path";
import { z } from "zod";

const detectedNodeEnv = process.env.NODE_ENV ?? "development";
const defaultDeployTarget = detectedNodeEnv === "production" ? "cloudbase" : "standalone";
const defaultStorageProvider = detectedNodeEnv === "production" ? "cloudbase" : "local";

const optionalEnvString = z.string().trim().optional().transform((value) => {
  if (!value) {
    return undefined;
  }

  return value;
});

const envBoolean = (defaultValue: boolean) =>
  z
    .string()
    .default(defaultValue ? "true" : "false")
    .transform((value) => value === "true");

const rawEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    APP_BASE_URL: z.string().url().default("http://localhost:4000"),
    ADMIN_APP_ORIGIN: z.string().default("http://localhost:5173"),
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    SESSION_COOKIE_NAME: z.string().min(1).default("portfolio_admin_session"),
    SESSION_TTL_HOURS: z.coerce.number().int().positive().default(168),
    DEPLOY_TARGET: z.enum(["standalone", "cloudbase"]).default(defaultDeployTarget),
    TRUST_PROXY: envBoolean(false),
    SERVE_FRONTEND_FROM_BACKEND: envBoolean(defaultDeployTarget === "standalone"),
    STORAGE_PROVIDER: z.enum(["local", "supabase", "cloudbase"]).default(defaultStorageProvider),
    SUPABASE_URL: optionalEnvString,
    SUPABASE_SERVICE_ROLE_KEY: optionalEnvString,
    SUPABASE_STORAGE_BUCKET: z.string().trim().default("portfolio-assets"),
    CLOUDBASE_ENV_ID: optionalEnvString,
    CLOUDBASE_SECRET_ID: optionalEnvString,
    CLOUDBASE_SECRET_KEY: optionalEnvString,
    CLOUDBASE_SESSION_TOKEN: optionalEnvString,
    CLOUDBASE_HTTP_PORT: z.coerce.number().int().positive().default(9000),
    ADMIN_SEED_USERNAME: optionalEnvString,
    ADMIN_SEED_PASSWORD: optionalEnvString,
    FRONTEND_DIST_DIR: z.string().default("../dist"),
    UPLOAD_DIR: z.string().default("./uploads"),
    MAX_IMAGE_UPLOAD_MB: z.coerce.number().positive().default(10),
    MAX_PDF_UPLOAD_MB: z.coerce.number().positive().default(50),
    MAX_RESUME_UPLOAD_MB: z.coerce.number().positive().default(20)
  })
  .superRefine((value, context) => {
    if (value.STORAGE_PROVIDER !== "supabase") {
      return;
    }

    if (!value.SUPABASE_URL) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SUPABASE_URL"],
        message: "SUPABASE_URL is required when STORAGE_PROVIDER=supabase"
      });
    }

    if (!value.SUPABASE_SERVICE_ROLE_KEY) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SUPABASE_SERVICE_ROLE_KEY"],
        message: "SUPABASE_SERVICE_ROLE_KEY is required when STORAGE_PROVIDER=supabase"
      });
    }

    const hasOnlyOneCloudBaseSecret =
      (Boolean(value.CLOUDBASE_SECRET_ID) && !value.CLOUDBASE_SECRET_KEY) ||
      (!value.CLOUDBASE_SECRET_ID && Boolean(value.CLOUDBASE_SECRET_KEY));

    if (hasOnlyOneCloudBaseSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CLOUDBASE_SECRET_ID"],
        message: "CLOUDBASE_SECRET_ID and CLOUDBASE_SECRET_KEY must be provided together"
      });
    }
  });

const parsed = rawEnvSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  isProduction: parsed.NODE_ENV === "production",
  port: parsed.PORT,
  appBaseUrl: parsed.APP_BASE_URL.replace(/\/$/, ""),
  adminAppOrigins: parsed.ADMIN_APP_ORIGIN.split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  databaseUrl: parsed.DATABASE_URL,
  directUrl: parsed.DIRECT_URL,
  deployTarget: parsed.DEPLOY_TARGET,
  sessionCookieName: parsed.SESSION_COOKIE_NAME,
  sessionTtlHours: parsed.SESSION_TTL_HOURS,
  trustProxy: parsed.TRUST_PROXY,
  serveFrontendFromBackend: parsed.SERVE_FRONTEND_FROM_BACKEND,
  storageProvider: parsed.STORAGE_PROVIDER,
  supabaseUrl: parsed.SUPABASE_URL ?? null,
  supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY ?? null,
  supabaseStorageBucket: parsed.SUPABASE_STORAGE_BUCKET,
  cloudbaseEnvId: parsed.CLOUDBASE_ENV_ID ?? null,
  cloudbaseSecretId: parsed.CLOUDBASE_SECRET_ID ?? null,
  cloudbaseSecretKey: parsed.CLOUDBASE_SECRET_KEY ?? null,
  cloudbaseSessionToken: parsed.CLOUDBASE_SESSION_TOKEN ?? null,
  cloudbaseHttpPort: parsed.CLOUDBASE_HTTP_PORT,
  adminSeedUsername: parsed.ADMIN_SEED_USERNAME ?? null,
  adminSeedPassword: parsed.ADMIN_SEED_PASSWORD ?? null,
  frontendDistDir: path.resolve(process.cwd(), parsed.FRONTEND_DIST_DIR),
  uploadRootDir: path.resolve(process.cwd(), parsed.UPLOAD_DIR),
  maxImageUploadBytes: parsed.MAX_IMAGE_UPLOAD_MB * 1024 * 1024,
  maxPdfUploadBytes: parsed.MAX_PDF_UPLOAD_MB * 1024 * 1024,
  maxResumeUploadBytes: parsed.MAX_RESUME_UPLOAD_MB * 1024 * 1024
};
