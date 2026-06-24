import { mealsRepository } from "../dataaccess/meals";
import { MealPlanMeal, MealWithNutrition } from "../types";
import { sumMealNutrition } from "./nutrition";

function withNutrition(meal: MealPlanMeal): MealWithNutrition {
  return {
    ...meal,
    nutrition: sumMealNutrition(meal),
  };
}

// Get meal with computed calories
async function getMeal(mealId: number): Promise<MealWithNutrition> {
  const meal = await mealsRepository.getMeal(mealId);
  return withNutrition(meal);
}

export const mealService = {
  sumMealNutrition,
  getMeal,
};
