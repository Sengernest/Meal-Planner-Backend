import { pgTable, integer, text, primaryKey } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export const foodsTable = pgTable("foods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  caloriesPer100g: integer(),
});

// Amount of a food item in a specific recipe, i.e. ingredients
export const foodsToRecipesTable = pgTable(
  "foods_to_recipes",
  {
    foodId: integer("food_id").references(() => foodsTable.id),
    recipeId: integer("recipe_id").references(() => recipesTable.id),
    amountInGrams: integer(),
  },
  (table) => [primaryKey({ columns: [table.foodId, table.recipeId] })],
);

export const recipesTable = pgTable("recipes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  authorId: integer("author_id").references(() => usersTable.id),
});

export const mealsTable = pgTable("meals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});
