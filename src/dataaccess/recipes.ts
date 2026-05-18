import { eq } from "drizzle-orm";
import db from "../db/db";
import { foodsToRecipesTable, recipesTable } from "../db/schema";
import { RecipeInsert, Ingredient, Recipe } from "../types";

export async function createRecipe(
  recipe: RecipeInsert,
  ingredients: Ingredient[],
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
    return {
      ...newRecipe,
      ingredients,
    };
  });
}

export async function getRecipes(): Promise<Recipe[]> {
  return await db.query.recipesTable.findMany({
    with: {
      ingredients: true,
    },
  });
}

export async function getRecipe(recipeId: number): Promise<Recipe> {
  const recipe = await db.query.recipesTable.findFirst({
    where: eq(recipesTable.id, recipeId),
    with: {
      ingredients: true,
    },
  });
  if (!recipe) {
    throw new Error("Recipe not found");
  }
  return recipe;
}

export async function updateRecipe(recipeId: number, newRecipe: RecipeInsert) {
  return await db
    .update(recipesTable)
    .set(newRecipe)
    .where(eq(recipesTable.id, recipeId));
}

export async function deleteRecipe(recipeId: number) {
  return await db.delete(recipesTable).where(eq(recipesTable.id, recipeId));
}
