import db from "../db/db";
import { eq } from "drizzle-orm";
import { nutritionGoalsTable } from "../db/schema";
import { NutritionGoals, NutritionGoalsInputWithMacros } from "../types";

async function getNutritionGoalsByUserId(userId: number): Promise<NutritionGoals | null> {
    const nutritionGoals = await db.query.nutritionGoalsTable.findFirst({
        where: eq(nutritionGoalsTable.creatorId, userId),
    })
    return nutritionGoals ?? null;
}

async function createNutritionGoals(userId: number, macros: NutritionGoalsInputWithMacros): Promise<NutritionGoals> {
    const [nutritionGoals] = await db.transaction(async (tx) => {
        return await tx
            .insert(nutritionGoalsTable)
            .values({
                creatorId: userId,
                ...macros
            })
            .returning();
    });

    return nutritionGoals;
}

async function updateNutritionGoals(userId: number, macros: NutritionGoalsInputWithMacros): Promise<NutritionGoals> {
    const [NutritionGoals] = await db
        .update(nutritionGoalsTable)
        .set({
            ...macros,
        })
        .where(eq(nutritionGoalsTable.creatorId, userId))
        .returning();

    return NutritionGoals;
}

async function deleteNutritionGoals(userId: number) {
    return await db.delete(nutritionGoalsTable).where(eq(nutritionGoalsTable.creatorId, userId));
}

export const nutritionGoalsRepository = {
    getNutritionGoalsByUserId,
    createNutritionGoals,
    updateNutritionGoals,
    deleteNutritionGoals
}