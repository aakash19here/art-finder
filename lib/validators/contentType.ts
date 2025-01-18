import { z } from "zod";

export const contentTypeSchema = z.object({
  domain: z.string().min(1),
});

export type ContentType = z.infer<typeof contentTypeSchema>;
