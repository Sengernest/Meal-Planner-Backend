import db from "../db/db";
import {  foodsTable } from "../db/schema";
import { FoodInsert, Food } from "../types";

export async function createFood(food: FoodInsert) {
  return await db.insert(foodsTable).values(food)
}

export async function getFoods(): Promise<Food[]> {
  return await db.select().from(foodsTable)
}

