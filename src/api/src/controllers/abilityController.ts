import type { Request, Response } from "express";
import { abilityService } from "../services/abilityService.js";
import { parseId } from "../utils/parseId.js";

// Controller: recebe req, chama o service e devolve res com o status certo.
// (No Express 5, erros em funções async vão sozinhos para o errorHandler.)
export const abilityController = {
    async listar(_req: Request, res: Response) {
        res.status(200).json(await abilityService.listar());
    },

    async buscar(req: Request, res: Response) {
        res.status(200).json(await abilityService.buscar(parseId(req.params.id)));
    },

    async criar(req: Request, res: Response) {
        res.status(201).json(await abilityService.criar(req.body));
    },

    async atualizar(req: Request, res: Response) {
        res.status(200).json(await abilityService.atualizar(parseId(req.params.id), req.body));
    },

    async remover(req: Request, res: Response) {
        await abilityService.remover(parseId(req.params.id));
        res.status(204).send();
    },
};
