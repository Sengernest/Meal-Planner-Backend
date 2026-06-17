import z from "zod";

export const profileSchema = z.object({
  name: z.string(),
  email: z.email(),
});

export type profileSchema = z.infer<typeof profileSchema>;

