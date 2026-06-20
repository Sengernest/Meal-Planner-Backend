import { nutritionGoalsRepository } from "../dataaccess/nutritionGoals";
import { NutritionGoals } from "../types";
import { NutritionGoalsSchema } from "../dto/nutritionGoals";

function calculateCalories(input: NutritionGoalsSchema) {
  const { age, gender, weight, height, activityLevel, goal } = input;

  // BMR (Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let tdee = bmr * multipliers[activityLevel];

  // Goal adjustment
  if (goal === "cutting") {
    tdee -= 400;
  }

  if (goal === "bulking") {
    tdee += 300;
  }

  const protein = weight * 2;
  const fat = (tdee * 0.25) / 9;
  const carbs = (tdee - protein * 4 - fat * 9) / 4;

  return {
    calories: Math.round(tdee),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

async function getNutritionGoalsByUserId(
  userId: number,
): Promise<NutritionGoals | null> {
  return await nutritionGoalsRepository.getNutritionGoalsByUserId(userId);
}

async function createNutritionGoals(
  userId: number,
  input: NutritionGoalsSchema,
): Promise<NutritionGoals> {
  const macros = calculateCalories(input);

  const NutritionGoals = await nutritionGoalsRepository.createNutritionGoals(userId, {
    ...input,
    ...macros,
  });

  return NutritionGoals;
}
async function updateNutritionGoals(
  userId: number,
  input: NutritionGoalsSchema,
): Promise<NutritionGoals> {
  const newMacros = calculateCalories(input);

  const updatedNutritionGoals = await nutritionGoalsRepository.updateNutritionGoals(
    userId,
    {
      ...input,
      ...newMacros,
    },
  );

  return updatedNutritionGoals;
}

async function deleteNutritionGoals(userId: number) {
  return nutritionGoalsRepository.deleteNutritionGoals(userId);
}

export const nutritionGoalsService = {
  getNutritionGoalsByUserId,
  createNutritionGoals,
  updateNutritionGoals,
  deleteNutritionGoals,
};
