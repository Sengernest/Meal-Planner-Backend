import { mealLogsRepository } from "../dataaccess/mealLogs";
import { MealLogSchema } from "../dto/mealLogs";
import { NotFoundError, UnauthorizedError } from "../errors/errors";
import { MealLog, Meal, MealLog } from "../types";
import { foodsService } from "./foods";
import { sumMealNutrition, sumMealsNutrition, sumNutrition } from "./nutrition";

function withNutrition(mealLog: MealLog): Meal {
  return {
    ...mealLog,
    nutrition: sumMealNutrition(mealLog),
    recipeItems: mealLog.recipeItems.map((recipeItem) => ({
      ...recipeItem,
      nutrition: sumNutrition(recipeItem.recipe.ingredients),
    })),
  };
}

async function getMealLogs(userId: number, logDate: Date): Promise<Meal[]> {
  const mealLogs = await mealLogsRepository.getMealLogs(userId, logDate);
  return mealLogs.map(withNutrition);
}

async function getDailyMealSummary(
  userId: number,
  date: Date,
): Promise<MealLog> {
  const mealLogs = await getMealLogs(userId, date);
  return {
    meals: mealLogs,
    nutrition: sumMealsNutrition(mealLogs),
  };
}

async function createMealLog(
  schema: MealLogSchema,
  userId: number,
): Promise<Meal> {
  // Check if food items have valid units
  for (const foodItem of schema.foodItems) {
    await foodsService.assertValidUnit(foodItem.foodId, foodItem.unitId);
  }

  const newLog = await mealLogsRepository.createMealLog(schema, userId);
  if (!newLog) {
    throw new NotFoundError();
  }
  return withNutrition(newLog);
}

async function updateMealLog(
  mealLogId: number,
  schema: MealLogSchema,
  userId: number,
): Promise<Meal> {
  // Check if food items have valid units
  for (const foodItem of schema.foodItems) {
    await foodsService.assertValidUnit(foodItem.foodId, foodItem.unitId);
  }

  const mealLog = await mealLogsRepository.getMealLog(mealLogId);
  if (!mealLog) {
    throw new NotFoundError();
  }
  // Ensure that the meal log can only be updated by the same user
  if (mealLog.userId !== userId) {
    throw new UnauthorizedError();
  }
  const updatedLog = await mealLogsRepository.updateMealLog(mealLogId, schema);
  if (!updatedLog) {
    throw new NotFoundError();
  }
  return withNutrition(updatedLog);
}

async function deleteMealLog(mealLogId: number, userId: number) {
  const mealLog = await mealLogsRepository.getMealLog(mealLogId);
  if (!mealLog) {
    throw new NotFoundError();
  }
  // Ensure that the meal log can only be deleted by the same user
  if (mealLog.userId !== userId) {
    throw new UnauthorizedError();
  }
  await mealLogsRepository.deleteMealLog(mealLogId);
  return mealLog;
}

export const mealLogsService = {
  getMealLogs,
  getDailyMealSummary,
  createMealLog,
  updateMealLog,
  deleteMealLog,
};
