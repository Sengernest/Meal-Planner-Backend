import { FoodItem, Nutrition } from "../types";

export function sumNutrition(foodItems: FoodItem[]): Nutrition {
  return foodItems.reduce(
    (acc, foodItem) => {
      const factor = foodItem.amount / 100;

      acc.calories += factor * foodItem.food.calories;
      acc.macros.protein += factor * foodItem.food.protein;
      acc.macros.carbs += factor * foodItem.food.carbs;
      acc.macros.fat += factor * foodItem.food.fat;

      return acc;
    },
    {
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    },
  );
}
