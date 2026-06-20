import z from "zod";

export const nutritionGoalsSchema = z.object({
  age: z.int().positive(),
  gender: z.enum(["male", "female"]),
  currentWeight: z.number().positive(),
  goalWeight: z.number().positive(),
  height: z.number().positive(),
  activityLevel: z.enum([
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ]),
  goal: z.enum(["bulk_0.5", "bulk_0.25", "maintenance", "cut_0.25", "cut_0.5"]),
});

export type NutritionGoalsSchema = z.infer<typeof nutritionGoalsSchema>;
