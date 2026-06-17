import { macroGoalsRepository } from "../dataaccess/macroGoals";
import { Profile, User } from "../types";
import { usersRepository } from "../dataaccess/users";

async function updateProfile(userId: number, profile: Profile): Promise<User> {
    const updatedProfile = await usersRepository.updateProfile(userId, profile);
    return updatedProfile;
}

export const usersService = {
    updateProfile
};
