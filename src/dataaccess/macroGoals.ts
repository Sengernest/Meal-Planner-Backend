import db from "../db/db";
import { eq } from "drizzle-orm";
import { macroGoalsTable } from "../db/schema";
import { MacroGoals, MacroGoalInput } from "../types";
import { calculateCalories } from "../services/macroGoals";

export async function getMacroGoalsByUserId(userId: number): Promise<MacroGoals[]> {
    return await db.query.macroGoalsTable.findMany({
        where: eq(macroGoalsTable.creatorId, userId)
    });
}

export async function createMacroGoals(userId: number, input: MacroGoalInput) {
  const macros = calculateCalories(input);

  const [macroGoal] = await db.transaction(async (tx) => {
    return await tx
      .insert(macroGoalsTable)
      .values({
        creatorId: userId,
        age: input.age,
        gender: input.gender,
        weight: input.weight,
        height: input.height,
        activityLevel: input.activityLevel,
        goal: input.goal,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      })
      .returning();
  });

  return macroGoal;
}