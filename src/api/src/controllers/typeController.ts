import type { Request, Response } from "express";
import { typeService } from "../services/typeService.js";
import { parseId } from "../utils/parseId.js";

// Controller: recebe req, chama o service e devolve res com o status certo.
// (No Express 5, erros em funções async vão sozinhos para o errorHandler.)
export const typeController = {
    async listar(_req: Request, res: Response) {
        res.status(200).json(await typeService.listar());
    },

    async buscar(req: Request, res: Response) {
        res.status(200).json(await typeService.buscar(parseId(req.params.id)));
    },

    async criar(req: Request, res: Response) {
        res.status(201).json(await typeService.criar(req.body));
    },

    async atualizar(req: Request, res: Response) {
        res.status(200).json(await typeService.atualizar(parseId(req.params.id), req.body));
    },

    async remover(req: Request, res: Response) {
        await typeService.remover(parseId(req.params.id));
        res.status(204).send();
    },
};
