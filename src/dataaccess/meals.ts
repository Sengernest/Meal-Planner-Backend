import { eq } from "drizzle-orm";
import db from "../db/db";
import {
  foodsToMealsTable,
  mealsTable,
  recipesToMealsTable,
} from "../db/schema";
import { Meal, MealCreateRequest, MealUpdateRequest } from "../types";

export async function getMeals(): Promise<Meal[]> {
  return await db.query.mealsTable.findMany({
    with: {
      recipeItems: {
        with: {
          recipe: true,
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

export async function getMeal(mealId: number): Promise<Meal> {
  const meal = await db.query.mealsTable.findFirst({
    where: eq(mealsTable.id, mealId),
    with: {
      recipeItems: {
        with: {
          recipe: true,
        },
      },
      foodItems: {
        with: {
          food: true,
        },
      },
    },
  });
  if (!meal) {
    throw new Error("Meal not found");
  }
  return meal;
}

export async function createMeal(mealRequest: MealCreateRequest) {
  return await db.transaction(async (tx) => {
    const [newMeal] = await tx
      .insert(mealsTable)
      .values(mealRequest.mealData)
      .returning();
    if (mealRequest.recipeItems.length > 0) {
      await tx.insert(recipesToMealsTable).values(
        mealRequest.recipeItems.map((recipeItem) => ({
          ...recipeItem,
          mealId: newMeal.id,
        })),
      );
    }
    if (mealRequest.foodItems.length > 0) {
      await tx.insert(foodsToMealsTable).values(
        mealRequest.foodItems.map((foodItem) => ({
          ...foodItem,
          mealId: newMeal.id,
        })),
      );
    }
    return getMeal(newMeal.id);
  });
}

export async function updateMeal(
  mealRequest: MealUpdateRequest,
) {
  return await db.transaction(async (tx) => {
    await tx
      .update(mealsTable)
      .set(mealRequest.mealData)
      .where(eq(mealsTable.id, mealRequest.mealId));

    // Delete all existing recipe items in the meal
    await tx
      .delete(recipesToMealsTable)
      .where(eq(recipesToMealsTable.mealId, mealRequest.mealId));
    // Delete all existing food items in the meal
    await tx
      .delete(foodsToMealsTable)
      .where(eq(foodsToMealsTable.mealId, mealRequest.mealId));

    // Replace with updated recipe items
    if (mealRequest.recipeItems.length > 0) {
      await tx.insert(recipesToMealsTable).values(
        mealRequest.recipeItems.map((recipeItem) => ({
          ...recipeItem,
          mealId: mealRequest.mealId,
        })),
      );
    }
    // Replace with updated meal items
    if (mealRequest.foodItems.length > 0) {
      await tx.insert(foodsToMealsTable).values(
        mealRequest.foodItems.map((foodItem) => ({
          ...foodItem,
          mealId: mealRequest.mealId,
        })),
      );
    }

    return getMeal(mealRequest.mealId);
  });
}

export async function deleteMeal(mealId: number) {
  return await db.delete(mealsTable).where(eq(mealsTable.id, mealId));
}
