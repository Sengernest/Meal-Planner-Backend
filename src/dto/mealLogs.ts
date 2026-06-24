import z from "zod";
import { mealSlotEnum } from "../db/schema";

export const foodEntrySchema = z.object({
  logDate: z.string(),
  mealSlot: z.enum(mealSlotEnum.enumValues),
  foodId: z.int().positive(),
  unitId: z.int().positive(),
  amount: z.number().positive(),
});

export const recipeEntrySchema = z.object({
  logDate: z.string(),
  mealSlot: z.enum(mealSlotEnum.enumValues),
  recipeId: z.int().positive(),
  servings: z.int().positive(),
});

export const mealLogSchema = z.object({
  logDate: z.coerce.date(),
  mealIndex: z.int().nonnegative(),
  mealId: z.int().positive().optional(), // Not null if meal is from meal plan, null if ad-hoc meal
  recipeItems: z.array(recipeEntrySchema),
  foodItems: z.array(foodEntrySchema),
});

export type FoodEntrySchema = z.infer<typeof foodEntrySchema>;
export type RecipeEntrySchema = z.infer<typeof recipeEntrySchema>;
export type MealLogSchema = z.infer<typeof mealLogSchema>;

export const mealLogsQuerySchema = z.object({
  date: z.coerce.date(),
});
