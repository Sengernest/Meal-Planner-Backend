import { Request, Response } from "express";
import { createMacroGoals, getMacroGoalsByUserId } from "../dataaccess/macroGoals";

export async function handleGetMacroGoals(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  const macroGoals = await getMacroGoalsByUserId(userId);
  res.json(macroGoals);
}

export async function handleCreateMacroGoals(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  const macroGoals = await createMacroGoals(userId, req.body);
  res.json(macroGoals);
}
