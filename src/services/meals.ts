import { mealsRepository } from "../dataaccess/meals";
import { CreateMealSchema, UpdateMealSchema } from "../dto/meals";
import { Nutrition, Meal, MealFood, MealWithNutrition } from "../types";
import { sumNutrition } from "./nutrition";

function sumMealNutrition(meal: Meal): Nutrition {
  const nutritionFromRecipes = meal.recipeItems.reduce(
    (acc, recipeItem) => {
      const recipeNutrition = sumNutrition(recipeItem.recipe.ingredients);
      acc.calories += recipeItem.servings * recipeNutrition.calories;
      acc.macros.protein +=
        recipeItem.servings * recipeNutrition.macros.protein;
      acc.macros.carbs += recipeItem.servings * recipeNutrition.macros.carbs;
      acc.macros.fat += recipeItem.servings * recipeNutrition.macros.fat;

      return acc;
    },
    {
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    },
  );
  const nutritionFromFoods = sumNutrition(meal.foodItems);

  return {
    calories: nutritionFromRecipes.calories + nutritionFromFoods.calories,
    macros: {
      protein:
        nutritionFromRecipes.macros.protein + nutritionFromFoods.macros.protein,
      carbs:
        nutritionFromRecipes.macros.carbs + nutritionFromFoods.macros.carbs,
      fat: nutritionFromRecipes.macros.fat + nutritionFromFoods.macros.fat,
    },
  };
}

function withNutrition(meal: Meal): MealWithNutrition {
  return {
    ...meal,
    nutrition: sumMealNutrition(meal),
  };
}

async function getMeals(): Promise<MealWithNutrition[]> {
  const meals = await mealsRepository.getMeals();
  return meals.map(withNutrition);
}

// Get meals created by a given user
async function getUserMeals(userId: number): Promise<MealWithNutrition[]> {
  const meals = await mealsRepository.getUserMeals(userId);
  return meals.map(withNutrition);
}

// Get meal with computed calories
async function getMeal(mealId: number): Promise<MealWithNutrition> {
  const meal = await mealsRepository.getMeal(mealId);
  return withNutrition(meal);
}

async function createMeal(meal: CreateMealSchema): Promise<MealWithNutrition> {
  const newMeal = await mealsRepository.createMeal(meal);
  return withNutrition(newMeal);
}

async function updateMeal(meal: UpdateMealSchema): Promise<MealWithNutrition> {
  const updatedMeal = await mealsRepository.updateMeal(meal);
  return withNutrition(updatedMeal);
}

async function deleteMeal(mealId: number) {
  return mealsRepository.deleteMeal(mealId);
}

export const mealsService = {
  getMeals,
  getUserMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
};
