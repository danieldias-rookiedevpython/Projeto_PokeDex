import type { Request, Response } from "express";
import { trainerService } from "../services/trainerService.js";
import { parseId } from "../utils/parseId.js";

// Controller: recebe req, chama o service e devolve res com o status certo.
// (No Express 5, erros em funções async vão sozinhos para o errorHandler.)
export const trainerController = {
    async listar(_req: Request, res: Response) {
        res.status(200).json(await trainerService.listar());
    },

    async buscar(req: Request, res: Response) {
        res.status(200).json(await trainerService.buscar(parseId(req.params.id)));
    },

    async criar(req: Request, res: Response) {
        res.status(201).json(await trainerService.criar(req.body));
    },

    async atualizar(req: Request, res: Response) {
        res.status(200).json(await trainerService.atualizar(parseId(req.params.id), req.body));
    },

    async remover(req: Request, res: Response) {
        await trainerService.remover(parseId(req.params.id));
        res.status(204).send();
    },
};
