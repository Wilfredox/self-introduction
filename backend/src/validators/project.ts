import { z } from "zod";

const projectStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

const projectLinkInputSchema = z.object({
  label: z.string().trim().min(1, "link label is required").max(80),
  url: z.string().trim().url("link url must be a valid URL").max(500),
  order: z.coerce.number().int().min(0).default(100)
});

const projectImageInputSchema = z.object({
  assetId: z.string().trim().min(1, "assetId is required"),
  caption: z.string().trim().max(240).nullish().transform((value) => value ?? null),
  order: z.coerce.number().int().min(0).default(100)
});

const projectScalarFieldsSchema = {
  title: z.string().trim().min(1, "title is required").max(160),
  slug: z.string().trim().max(160).optional(),
  excerpt: z.string().trim().min(1, "excerpt is required").max(500),
  description: z.string().trim().min(1, "description is required").max(20000),
  period: z.string().trim().min(1, "period is required").max(80),
  role: z.string().trim().max(160).nullish().transform((value) => value ?? null),
  highlights: z.array(z.string().trim().min(1).max(240)).max(20).default([]),
  notes: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  coverAssetId: z.string().trim().min(1).nullable().optional(),
  pdfAssetId: z.string().trim().min(1).nullable().optional(),
  status: projectStatusSchema.default("DRAFT")
};

export const createProjectSchema = z.object({
  ...projectScalarFieldsSchema,
  images: z.array(projectImageInputSchema).max(40).default([]),
  links: z.array(projectLinkInputSchema).max(20).default([]),
  sortOrder: z.coerce.number().int().min(0).optional()
});

export const updateProjectSchema = z
  .object({
    title: projectScalarFieldsSchema.title.optional(),
    slug: projectScalarFieldsSchema.slug,
    excerpt: projectScalarFieldsSchema.excerpt.optional(),
    description: projectScalarFieldsSchema.description.optional(),
    period: projectScalarFieldsSchema.period.optional(),
    role: projectScalarFieldsSchema.role.optional(),
    highlights: projectScalarFieldsSchema.highlights.optional(),
    notes: projectScalarFieldsSchema.notes.optional(),
    coverAssetId: projectScalarFieldsSchema.coverAssetId,
    pdfAssetId: projectScalarFieldsSchema.pdfAssetId,
    status: projectStatusSchema.optional(),
    images: z.array(projectImageInputSchema).max(40).optional(),
    links: z.array(projectLinkInputSchema).max(20).optional()
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required for project update"
  );

export const sortProjectsSchema = z.object({
  projectIds: z.array(z.string().trim().min(1)).min(1, "projectIds is required")
});
