import { Request, Response } from "express";
import { nutritionGoalsService } from "../services/nutritionGoals";

export async function handleGetNutritionGoals(req: Request, res: Response) {
  const userId = req.user?.id!;
  const nutritionGoals = await nutritionGoalsService.getNutritionGoalsByUserId(userId);
  if (!nutritionGoals) {
    return res.json(null);
  }
  res.json(nutritionGoals);
}

export async function handleCreateNutritionGoals(req: Request, res: Response) {
  const userId = req.user?.id!;
  const nutritionGoals = await nutritionGoalsService.createNutritionGoals(userId, req.body);
  res.json(nutritionGoals);
}

export async function handleUpdateNutritionGoals(req: Request, res: Response) {
  const userId = req.user?.id!;
  const updatedNutritionGoals = await nutritionGoalsService.updateNutritionGoals(
    userId,
    req.body,
  );
  res.json(updatedNutritionGoals);
}

export async function handleDeleteNutritionGoals(req: Request, res: Response) {
  const userId = req.user?.id!;
  await nutritionGoalsService.deleteNutritionGoals(userId);
  res.json({ message: `Deleted nutrition goals` });
}
