import { macroGoalsRepository } from "../dataaccess/macroGoals";
import { MacroGoals } from "../types";
import { MacroGoalsInput } from "../dto/macroGoals";

function calculateCalories(input: MacroGoalsInput) {
    const {
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal,
    } = input;

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
};

async function getMacroGoalsByUserId(userId: number): Promise<MacroGoals | null> {
    return await macroGoalsRepository.getMacroGoalsByUserId(userId);
};

async function createMacroGoals(userId: number, input: MacroGoalsInput): Promise<MacroGoals> {
    const macros = calculateCalories(input);

    const macroGoals = await macroGoalsRepository.createMacroGoals(
        userId,
        {
            ...input,
            ...macros,
        }
    );

    return macroGoals;
}
async function updateMacroGoals(userId: number, input: MacroGoalsInput): Promise<MacroGoals> {
    const newMacros = calculateCalories(input);

    const updatedMacroGoals =
        await macroGoalsRepository.updateMacroGoals(userId, {
            ...input,
            ...newMacros,
        });

    return updatedMacroGoals;
}

async function deleteMacroGoals(userId: number) {
    return macroGoalsRepository.deleteMacroGoals(userId);
}

export const macroGoalsService = {
    getMacroGoalsByUserId,
    createMacroGoals,
    updateMacroGoals,
    deleteMacroGoals
}




