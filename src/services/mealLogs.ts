import { mealLogsRepository } from "../dataaccess/mealLogs";
import { CreateMealLogSchema, UpdateMealLogSchema } from "../dto/mealLogs";
import { MealLog, MealLogWithNutrition } from "../types";
import { sumMealNutrition } from "./nutrition";

function withNutrition(mealLog: MealLog): MealLogWithNutrition {
  return {
    ...mealLog,
    nutrition: sumMealNutrition(mealLog),
  };
}

async function getMealLogs(
  userId: number,
  logDate: string,
): Promise<MealLogWithNutrition[]> {
  const mealLogs = await mealLogsRepository.getMealLogs(userId, logDate);
  return mealLogs.map(withNutrition);
}

async function createMealLog(
  mealLog: CreateMealLogSchema,
): Promise<MealLogWithNutrition> {
  const newLog = await mealLogsRepository.createMealLog(mealLog);
  return withNutrition(newLog);
}

async function updateMealLog(
  mealLog: UpdateMealLogSchema,
): Promise<MealLogWithNutrition> {
  const updatedLog = await mealLogsRepository.updateMealLog(mealLog);
  return withNutrition(updatedLog);
}

async function deleteMealLog(id: number) {
  return mealLogsRepository.deleteMealLog(id);
}

export const mealLogsService = {
  getMealLogs,
  createMealLog,
  updateMealLog,
  deleteMealLog,
};
