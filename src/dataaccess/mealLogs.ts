import { and, eq } from "drizzle-orm";
import db from "../db/db";
import {
  foodsToMealLogsTable,
  mealLogsTable,
  recipesToMealLogsTable
} from "../db/schema";
import {
  CreateMealLogSchema,
  UpdateMealLogSchema
} from "../dto/mealLogs";
import { MealLog } from "../types";

// Get meal logs by a user on a given date
export async function getMealLogs(
  userId: number,
  logDate: Date,
): Promise<MealLog[]> {
  return await db.query.mealLogsTable.findMany({
    where: and(
      eq(mealLogsTable.userId, userId),
      eq(mealLogsTable.logDate, logDate),
    ),
    with: {
      recipeItems: {
        with: {
          recipe: {
            with: {
              ingredients: {
                with: {
                  food: true,
                },
              },
            },
          },
        },
      },
      foodItems: {
        with: {
          food: true,
        },
      },
    },
  });
}

export async function getMealLog(mealLogId: number): Promise<MealLog> {
  const mealLog = await db.query.mealLogsTable.findFirst({
    where: eq(mealLogsTable.id, mealLogId),
    with: {
      recipeItems: {
        with: {
          recipe: {
            with: {
              ingredients: {
                with: {
                  food: true,
                },
              },
            },
          },
        },
      },
      foodItems: {
        with: {
          food: true,
        },
      },
    },
  });
  if (!mealLog) {
    throw new Error("Meal log not found");
  }
  return mealLog;
}

export async function createMealLog(mealLog: CreateMealLogSchema) {
  return await db.transaction(async (tx) => {
    const [newMealLog] = await tx
      .insert(mealLogsTable)
      .values({
        userId: mealLog.userId,
        logDate: mealLog.logDate,
        slot: mealLog.slot,
        mealId: mealLog.mealId,
      })
      .returning();
    if (mealLog.recipeItems.length > 0) {
      await tx.insert(recipesToMealLogsTable).values(
        mealLog.recipeItems.map((recipeItem) => ({
          ...recipeItem,
          mealLogId: newMealLog.id,
        })),
      );
    }
    if (mealLog.foodItems.length > 0) {
      await tx.insert(foodsToMealLogsTable).values(
        mealLog.foodItems.map((foodItem) => ({
          ...foodItem,
          mealLogId: newMealLog.id,
        })),
      );
    }
    return getMealLog(newMealLog.id);
  });
}

export async function updateMealLog(mealLog: UpdateMealLogSchema) {
  return await db.transaction(async (tx) => {
    await tx
      .update(mealLogsTable)
      .set({
        userId: mealLog.userId,
        logDate: mealLog.logDate,
        slot: mealLog.slot,
        mealId: mealLog.mealId,
      })
      .where(eq(mealLogsTable.id, mealLog.mealLogId));

    // Delete all existing recipe items in the meal log
    await tx
      .delete(recipesToMealLogsTable)
      .where(eq(recipesToMealLogsTable.mealLogId, mealLog.mealLogId));
    // Delete all existing food items in the meal log
    await tx
      .delete(foodsToMealLogsTable)
      .where(eq(foodsToMealLogsTable.mealLogId, mealLog.mealLogId));

    if (mealLog.recipeItems.length > 0) {
      await tx.insert(recipesToMealLogsTable).values(
        mealLog.recipeItems.map((recipeItem) => ({
          ...recipeItem,
          mealLogId: mealLog.mealLogId,
        })),
      );
    }
    if (mealLog.foodItems.length > 0) {
      await tx.insert(foodsToMealLogsTable).values(
        mealLog.foodItems.map((foodItem) => ({
          ...foodItem,
          mealLogId: mealLog.mealLogId,
        })),
      );
    }

    return getMealLog(mealLog.mealLogId);
  });
}

export async function deleteMealLog(mealLogId: number) {
  return await db.delete(mealLogsTable).where(eq(mealLogsTable.id, mealLogId));
}
