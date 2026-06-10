import { ilike, sql } from "drizzle-orm";
import db from "../db/db";
import { foodsTable } from "../db/schema";
import { FoodInput, Food, SearchResult } from "../types";

async function getFoods(): Promise<Food[]> {
  return await db.select().from(foodsTable);
}

// Returns a list of foods with names matching the given search query
async function searchFood(
  query: string,
  limit = 20,
): Promise<SearchResult<Food>[]> {
  return await db
    .select({
      item: foodsTable,
      score: sql<number>`similarity(${foodsTable.name}, ${query})`,
    })
    .from(foodsTable)
    .where(sql`${foodsTable.name} % ${query}`)
    .orderBy(sql`similarity(${foodsTable.name}, ${query}) DESC`)
    .limit(limit);
}

export const foodsRepository = {
  getFoods,
  searchFood,
};
