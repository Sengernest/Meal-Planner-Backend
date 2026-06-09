import fs from "node:fs/promises";
import db from "./db";
import { foodsTable } from "./schema";

async function main() {
  const baseFoodFile = await fs.readFile("data/foundation_food.json", "utf8");
  const baseFoods = JSON.parse(baseFoodFile)["FoundationFoods"];

  const batchSize = 500;

  for (let i = 0; i < baseFoods.length; i += batchSize) {
    const batch = baseFoods.slice(i, i + batchSize);

    const values = batch.map((food: any) => {
      const nutrients = food["foodNutrients"];
      const calories = nutrients.find(
        (nutrient: any) => nutrient.nutrient.id == 2047,
      ).amount;
      const carbs = nutrients.find(
        (nutrient: any) => nutrient.nutrient.name == 1003,
      ).amount;
      const fat = nutrients.find(
        (nutrient: any) => nutrient.nutrient.name == 1004,
      ).amount;
      const protein = nutrients.find(
        (nutrient: any) => nutrient.nutrient.name == 1005,
      ).amount;

      return {
        id: food["fdcId"],
        name: food["description"],
        defaultServingSize: food["foodPortions"][0]["gramWeight"],
        calories,
        carbs,
        fat,
        protein,
      };
    });

    await db.insert(foodsTable).values(values);
  }
}

main();
