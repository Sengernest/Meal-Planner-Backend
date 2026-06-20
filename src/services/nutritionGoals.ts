import { nutritionGoalsRepository } from "../dataaccess/nutritionGoals";
import { NutritionGoals, NutritionGoalsInput } from "../types";

function calculateNutritionGoals(input: NutritionGoalsInput) {
  const {
    age,
    gender,
    currentWeight,
    height,
    activityLevel,
    goal,
    goalWeight
  } = input;

  // BMR (Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * currentWeight + 6.25 * height - 5 * age + 5
      : 10 * currentWeight + 6.25 * height - 5 * age - 161;

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let tdee = bmr * multipliers[activityLevel];

  const calorieAdjustmentMap: Record<string, number> = {
    "bulk_0.5": 550,
    "bulk_0.25": 275,
    maintenance: 0,
    "cut_0.25": -275,
    "cut_0.5": -550,
  };

  const weeklyRateMap: Record<string, number> = {
    "bulk_0.5": 0.5,
    "bulk_0.25": 0.25,
    maintenance: 0,
    "cut_0.25": -0.25,
    "cut_0.5": -0.5,
  };

  const adjustment = calorieAdjustmentMap[goal] ?? 0;
  tdee += adjustment;

  // Macros
  const protein = currentWeight * 2;

  const fat = (tdee * 0.25) / 9;
  const carbs = (tdee - protein * 4 - fat * 9) / 4;

  // ETA
  const deltaKg = currentWeight - goalWeight;
  const weeklyRate = weeklyRateMap[goal];

  let etaWeeks: number | null = null;

  if (goal !== "maintenance" && weeklyRate !== 0) {
    // only valid if direction matches
    const directionMatches =
      (deltaKg > 0 && weeklyRate < 0) || (deltaKg < 0 && weeklyRate > 0);

    if (directionMatches) {
      etaWeeks = Math.abs(deltaKg / weeklyRate);
    }
  }

  return {
    calories: Math.round(tdee),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    etaWeeks: etaWeeks === null ? null : Math.round(etaWeeks),
  };
}

async function getNutritionGoalsByUserId(
  userId: number,
): Promise<NutritionGoals | null> {
  return await nutritionGoalsRepository.getNutritionGoalsByUserId(userId);
}

async function createNutritionGoals(
  userId: number,
  input: NutritionGoalsInput,
): Promise<NutritionGoals> {

  const nutrition = calculateNutritionGoals(input);

  const nutritionGoals = await nutritionGoalsRepository.createNutritionGoals(userId, {
    ...input,
    ...nutrition,
  });

  return nutritionGoals;
}

async function updateNutritionGoals(
  userId: number,
  input: NutritionGoalsInput,
): Promise<NutritionGoals> {
  const newNutrition = calculateNutritionGoals(input);

  const updatedNutritionGoals = await nutritionGoalsRepository.updateNutritionGoals(
    userId,
    {
      ...input,
      ...newNutrition,
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
