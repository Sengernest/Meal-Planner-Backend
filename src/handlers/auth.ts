import { Request, Response } from "express";
import { authService } from "../services/auth";

export async function handleSignup(req: Request, res: Response) {
  const { user, token } = await authService.handleSignup(req.body);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
  res.json(user);
};

export async function handleLogin(req: Request, res: Response) {
  try {
    const { user, token } = await authService.handleLogin(req.body);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export async function handleLogout(req: Request, res: Response) {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
}

