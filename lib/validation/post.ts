import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(4, "Title must be at least 4 characters")
    .max(100, "Title can be at most 100 characters"),
  excerpt: z
    .string()
    .min(4, "Excerpt must be at least 4 characters")
    .max(300, "Excerpt can be at most 300 characters")
    .optional()
    .or(z.literal("")),
  body: z.record(z.string(), z.unknown()),   // Tiptap JSON — structure validated by Tiptap itself
  status: z.enum(["draft", "published"]),
  category_ids: z.array(z.string().uuid()).optional(),
});

export const postDraftSchema = postSchema.partial({
  excerpt: true,
  category_ids: true,
});

export type PostInput = z.infer<typeof postSchema>;
export type PostDraftInput = z.infer<typeof postDraftSchema>;
