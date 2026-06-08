import { Request, Response } from "express";
import { mealsService } from '../services/meals';

export async function handleGetMeals(req: Request, res: Response) {
  const meals = await mealsService.getMeals();
  res.json(meals);
}

export async function handleGetUserMeals(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const meals = await mealsService.getUserMeals(userId);
  res.json(meals);
}

export async function handleGetMeal(req: Request, res: Response) {
  const mealId = Number(req.params.id);
  const meal = await mealsService.getMeal(mealId);
  res.json(meal);
}

export async function handleCreateMeal(req: Request, res: Response) {
  const meal = await mealsService.createMeal(req.body);
  res.json(meal);
}

export async function handleUpdateMeal(req: Request, res: Response) {
  const updatedMeal = await mealsService.updateMeal(req.body);
  res.json(updatedMeal);
}

export async function handleDeleteMeal(req: Request, res: Response) {
  const mealId = Number(req.params.id);
  await mealsService.deleteMeal(mealId);
  res.json({ message: `Deleted meal: ${mealId}` });
}
