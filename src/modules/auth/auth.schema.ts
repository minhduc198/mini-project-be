import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").min(5, "Email too short"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
