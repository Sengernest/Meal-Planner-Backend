import { ilike, sql } from "drizzle-orm";
import db from "../db/db";
import { foodsTable } from "../db/schema";
import { FoodInput, Food, FoodSearchResult } from "../types";

export async function createFood(food: FoodInput) {
  return await db.insert(foodsTable).values(food);
}

export async function getFoods(): Promise<Food[]> {
  return await db.select().from(foodsTable);
}

// Returns a list of foods with names matching the given search query
export async function searchFood(query: string, limit = 20): Promise<FoodSearchResult[]> {
  return await db
    .select({
      food: foodsTable,
      score: sql<number>`similarity(${foodsTable.name}, ${query})`,
    })
    .from(foodsTable)
    .where(sql`${foodsTable.name} % ${query}`)
    .orderBy(sql`similarity(${foodsTable.name}, ${query}) DESC`)
    .limit(limit);
}
