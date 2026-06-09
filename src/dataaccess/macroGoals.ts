import db from "../db/db";
import { eq } from "drizzle-orm";
import { macroGoalsTable } from "../db/schema";
import { MacroGoals, MacroGoalsInputWithMacros } from "../types";

async function getMacroGoalsByUserId(userId: number): Promise<MacroGoals | null> {
    const macroGoals = await db.query.macroGoalsTable.findFirst({
        where: eq(macroGoalsTable.creatorId, userId),
    })
    return macroGoals ?? null;
}

async function createMacroGoals(userId: number, macros: MacroGoalsInputWithMacros): Promise<MacroGoals> {
    const [macroGoals] = await db.transaction(async (tx) => {
        return await tx
            .insert(macroGoalsTable)
            .values({
                creatorId: userId,
                ...macros
            })
            .returning();
    });

    return macroGoals;
}

async function updateMacroGoals(userId: number, macros: MacroGoalsInputWithMacros): Promise<MacroGoals> {
    const [macroGoals] = await db
        .update(macroGoalsTable)
        .set({
            ...macros,
        })
        .where(eq(macroGoalsTable.creatorId, userId))
        .returning();

    return macroGoals;
}

async function deleteMacroGoals(userId: number) {
    return await db.delete(macroGoalsTable).where(eq(macroGoalsTable.creatorId, userId));
}

export const macroGoalsRepository = {
    getMacroGoalsByUserId,
    createMacroGoals,
    updateMacroGoals,
    deleteMacroGoals
}