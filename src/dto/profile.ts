import z from "zod";

export const profileSchema = z.object({
    name: z.string(),
    email: z.email(),
    birthDate: z.string().optional(),
    height: z.number().optional(),
    gender: z.enum(["male", "female"]).optional(),
});

export type profileSchema = z.infer<typeof profileSchema>;

