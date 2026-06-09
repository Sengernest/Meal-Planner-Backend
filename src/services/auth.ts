import { usersRepository } from "../dataaccess/users";
import { User, UserInput } from "../types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function createToken(userId: number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "3d" });
};

async function handleSignup(userInput: UserInput): Promise<{ user: User, token: string }> {
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const user = await usersRepository.createUser({
        ...userInput,
        password: hashedPassword,
    });
    const token = createToken(user.id);
    return { user, token };
}

async function handleLogin(userInput: UserInput): Promise<{ user: User, token: string }> {
    const user = await usersRepository.getUserByEmail(userInput.email)
    if (user && await bcrypt.compare(userInput.password, user.password)) {
        const token = createToken(user.id);
        return { user, token };
    } else {
        throw new Error("Invalid credentials");
    }
};

export const authService = {
    handleSignup,
    handleLogin,
};
