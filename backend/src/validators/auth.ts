import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "username is required").max(80),
  password: z.string().min(8, "password must be at least 8 characters").max(255)
});
