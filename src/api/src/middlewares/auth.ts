import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "pokedex-dev-secret-change-me";

export interface AuthenticatedRequest extends Request {
    authUser?: {
        id: number;
        name: string;
        email: string;
    };
}

export function autenticar(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new AppError(401, "Autenticação necessária."));
    }

    try {
        const payload = jwt.verify(header.slice("Bearer ".length), JWT_SECRET);
        if (typeof payload === "string") {
            return next(new AppError(401, "Token inválido."));
        }

        (req as AuthenticatedRequest).authUser = {
            id: Number(payload.id),
            name: String(payload.name),
            email: String(payload.email),
        };
        return next();
    } catch {
        return next(new AppError(401, "Token inválido ou expirado."));
    }
}
