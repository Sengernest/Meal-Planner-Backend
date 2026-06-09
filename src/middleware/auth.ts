import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decodedToken: any) => {
        if (err) {
            res.status(401).json({ error: "Invalid token" });
        }
        
        (req as any).user = { userId: decodedToken.userId };
        const paramId = Number(req.params.id);
        if (paramId !== decodedToken.userId) {
            return res.status(403).json({
                error: "Forbidden",
            });
        }
        next();
    });
};

export function requireUserMatch(req: Request, res: Response, next: NextFunction) {
    const paramId = Number(req.params.id);
    const userId = (req as any).user.userId;

    if (paramId !== userId) {
        return res.status(403).json({
            error: "Forbidden",
        });
    }

    next();
}