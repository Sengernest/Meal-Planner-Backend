import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {

  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    res.redirect("/login");
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decodedToken: any) => {
    if (err) {
      res.status(401).json({ error: "Invalid token" });
      res.redirect("/login");
    }

    console.log("Decoded JWT:", decodedToken);

    (req as any).user = { userId: decodedToken.userId };

    next();
  });
}