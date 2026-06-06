import z from "zod";

export const calculateMacroGoalsSchema = z.object({
  age: z.int().positive(),
  gender: z.enum(["male", "female"]),
  weight: z.number().positive(),
  height: z.number().positive(),
  activityLevel: z.enum([ "sedentary", "light", "moderate", "active", "very_active" ]),
  goal: z.enum(["cutting", "bulking", "maintenance"]),
}); 

export type CalculateMacroGoalsInput = z.infer<typeof calculateMacroGoalsSchema>
