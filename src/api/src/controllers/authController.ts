import type { Request, Response } from "express";
import { authService } from "../services/authService.js";

export const authController = {
    async cadastrar(req: Request, res: Response) {
        res.status(201).json(await authService.cadastrar(req.body));
    },

    async login(req: Request, res: Response) {
        const result = await authService.login(req.body);
        res.status(200).json({ mensagem: "Login realizado com sucesso.", ...result });
    },
};
