import { eq } from "drizzle-orm";
import db from "../db/db";
import { foodsToRecipesTable, recipesTable } from "../db/schema";
import { IngredientInput, Recipe, RecipeInput } from "../types";

export async function getRecipes(): Promise<Recipe[]> {
  return await db.query.recipesTable.findMany({
    with: {
      ingredients: {
        columns: {
          amountInGrams: true,
        },
        with: {
          food: true,
        },
      },
    },
  });
}

export async function getRecipe(recipeId: number): Promise<Recipe> {
  const recipe = await db.query.recipesTable.findFirst({
    where: eq(recipesTable.id, recipeId),
    with: {
      ingredients: {
        columns: {
          amountInGrams: true,
        },
        with: {
          food: true,
        },
      },
    },
  });
  if (!recipe) {
    throw new Error("Recipe not found");
  }
  return recipe;
}

export async function createRecipe(
  recipe: RecipeInput,
  ingredients: IngredientInput[],
): Promise<Recipe> {
  return await db.transaction(async (tx) => {
    const [newRecipe] = await tx
      .insert(recipesTable)
      .values(recipe)
      .returning();
    await tx
      .insert(foodsToRecipesTable)
      .values(
        ingredients.map((ingredient) => ({
          ...ingredient,
          recipeId: newRecipe.id,
        })),
      )
      .returning();
    return getRecipe(newRecipe.id);
  });
}

export async function updateRecipe(
  recipeId: number,
  recipeData: RecipeInput,
  ingredients: IngredientInput[],
): Promise<Recipe> {
  return await db.transaction(async (tx) => {
    await tx
      .update(recipesTable)
      .set(recipeData)
      .where(eq(recipesTable.id, recipeId));

    // Delete all existing ingredients
    await tx
      .delete(foodsToRecipesTable)
      .where(eq(foodsToRecipesTable.recipeId, recipeId));
    // Replace with updated ingredients
    await tx.insert(foodsToRecipesTable).values(
      ingredients.map((ingredient) => ({
        ...ingredient,
        recipeId,
      })),
    );

    return getRecipe(recipeId);
  });
}

export async function deleteRecipe(recipeId: number) {
  return await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
}
