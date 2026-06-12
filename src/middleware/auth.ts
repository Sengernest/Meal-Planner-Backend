import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decodedToken: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = { id: decodedToken.userId };
    next();
  });
}
