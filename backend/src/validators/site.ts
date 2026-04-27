import { z } from "zod";

const hrefSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:"),
    "href must be an http(s), mailto, or tel link"
  );

export const contactItemSchema = z.object({
  label: z.string().trim().min(1, "contact label is required").max(80),
  value: z.string().trim().min(1, "contact value is required").max(160),
  href: hrefSchema,
  order: z.coerce.number().int().min(0).default(100)
});

export const updateSiteSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  tagline: z.string().trim().min(1, "tagline is required").max(240),
  contacts: z.array(contactItemSchema).max(20).default([])
});
