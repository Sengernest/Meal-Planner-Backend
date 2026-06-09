import { Request, Response } from "express";
import { macroGoalsService } from "../services/macroGoals";

export async function handleGetMacroGoals(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const macroGoals = await macroGoalsService.getMacroGoalsByUserId(userId);
    if (!macroGoals) {
        return res.status(404).json({
            error: "Macro goals not found",
        });
    }
    res.json(macroGoals);
}

export async function handleCreateMacroGoals(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const macroGoals = await macroGoalsService.createMacroGoals(userId, req.body);
    res.json(macroGoals);
}

export async function handleUpdateMacroGoals(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const updatedMacroGoals = await macroGoalsService.updateMacroGoals(userId, req.body);
    res.json(updatedMacroGoals);
}

export async function handleDeleteMacroGoals(req: Request, res: Response) {
    const userId = Number(req.params.id);
    await macroGoalsService.deleteMacroGoals(userId);
    res.json({ message: `Deleted macro goals` });
}
