import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(30, "Username can be at most 30 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

export const signupSchema = z.object({
  username: usernameSchema,
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().max(80).optional(),
  bio: z.string().max(300).optional(),
  location: z.string().max(100).optional(),
  website: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
