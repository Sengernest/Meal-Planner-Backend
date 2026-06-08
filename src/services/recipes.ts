import { recipesRepository } from "../dataaccess/recipes";
import { CreateRecipeSchema, UpdateRecipeSchema } from "../dto/recipes";
import {
  FoodItem,
  Nutrition,
  Recipe,
  RecipeFood,
  RecipeWithNutrition,
} from "../types";
import { sumNutrition } from "./nutrition";

function withNutrition(recipe: Recipe): RecipeWithNutrition {
  return {
    ...recipe,
    nutrition: sumNutrition(recipe.ingredients),
  };
}

async function getRecipes(): Promise<RecipeWithNutrition[]> {
  const recipes = await recipesRepository.getRecipes();
  return recipes.map(withNutrition);
}

// Get recipes created by a given user
async function getUserRecipes(userId: number): Promise<RecipeWithNutrition[]> {
  const recipes = await recipesRepository.getUserRecipes(userId);
  return recipes.map(withNutrition);
}

// Get recipe with computed calories
async function getRecipe(recipeId: number): Promise<RecipeWithNutrition> {
  const recipe = await recipesRepository.getRecipe(recipeId);
  return withNutrition(recipe);
}

async function createRecipe(
  recipe: CreateRecipeSchema,
): Promise<RecipeWithNutrition> {
  const newRecipe = await recipesRepository.createRecipe(recipe);
  return withNutrition(newRecipe);
}

async function updateRecipe(
  recipe: UpdateRecipeSchema,
): Promise<RecipeWithNutrition> {
  const updatedRecipe = await recipesRepository.updateRecipe(recipe);
  return withNutrition(updatedRecipe);
}

async function deleteRecipe(recipeId: number) {
  return recipesRepository.deleteRecipe(recipeId);
}

export const recipesService = {
  getRecipes,
  getUserRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
