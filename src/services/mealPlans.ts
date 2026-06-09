import { mealPlansRepository } from "../dataaccess/mealPlans";
import { CreateMealPlanSchema, UpdateMealPlanSchema } from "../dto/mealPlans";

async function getSampleMealPlans() {
  const mealPlans = await mealPlansRepository.getSampleMealPlans();
  return mealPlans;
}

async function getUserMealPlans(userId: number) {
  const mealPlans = await mealPlansRepository.getUserMealPlans(userId);
  return mealPlans;
}

async function getMealPlan(mealPlanId: number) {
  const mealPlan = await mealPlansRepository.getMealPlan(mealPlanId);
  return mealPlan;
}

async function createMealPlan(schema: CreateMealPlanSchema) {
  const mealPlan = await mealPlansRepository.createMealPlan(schema);
  return mealPlan;
}

async function updateMealPlan(schema: UpdateMealPlanSchema) {
  const mealPlan = await mealPlansRepository.updateMealPlan(schema);
  return mealPlan;
}

async function deleteMealPlan(mealPlanId: number) {
  return mealPlansRepository.deleteMealPlan(mealPlanId);
}

export const mealPlansService = {
  getSampleMealPlans,
  getUserMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
