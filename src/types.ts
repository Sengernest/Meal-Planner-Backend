import {
  usersTable,
  foodsTable,
  recipesTable,
  foodsToRecipesTable,
  mealsTable,
} from "./db/schema";

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
export type Food = typeof foodsTable.$inferSelect;
export type FoodInsert = typeof foodsTable.$inferInsert;
export type RecipeSelect = typeof recipesTable.$inferSelect;
export type RecipeInsert = typeof recipesTable.$inferInsert;
export type Ingredient = {
  amountInGrams: number;
  food: Food | null;
};
export type Recipe = RecipeSelect & { ingredients: Ingredient[] };
export type Meal = typeof mealsTable.$inferSelect;
export type MealInsert = typeof mealsTable.$inferInsert;
