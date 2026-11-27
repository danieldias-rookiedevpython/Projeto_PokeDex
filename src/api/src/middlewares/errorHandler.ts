import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

type ErroConhecido = {
    code?: string;
    type?: string;
    meta?: {
        target?: unknown;
        driverAdapterError?: { cause?: { constraint?: { fields?: unknown } } };
    };
};

// Descobre quais campos @unique causaram o conflito (varia conforme o driver do Prisma).
function camposDuplicados(meta: ErroConhecido["meta"]): string[] {
    const target = meta?.target;
    if (Array.isArray(target)) return target.map(String);
    if (typeof target === "string") return [target];

    const fields = meta?.driverAdapterError?.cause?.constraint?.fields;
    if (Array.isArray(fields)) return fields.map(String);

    return [];
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
    // Erros que nós mesmos lançamos (404, 409, 401...)
    if (err instanceof AppError) {
        res.status(err.status).json({ error: err.message });
        return;
    }

    const erro = (err ?? {}) as ErroConhecido;

    // JSON malformado no corpo da requisição
    if (erro.type === "entity.parse.failed") {
        res.status(400).json({ error: "JSON inválido no corpo da requisição." });
        return;
    }

    // Prisma P2002: valor repetido em campo @unique
    if (erro.code === "P2002") {
        const campos = camposDuplicados(erro.meta);
        const detalhe = campos.length > 0 ? ` Campo(s): ${campos.join(", ")}.` : "";
        res.status(409).json({
            error: `Já existe um registro com esse valor, que deve ser único.${detalhe}`,
        });
        return;
    }

    // Prisma P2003: violação de chave estrangeira
    if (erro.code === "P2003") {
        if (req.method === "DELETE") {
            res.status(409).json({
                error: "Não é possível remover: existem pokémons ligados a este registro.",
            });
        } else {
            res.status(400).json({
                error: "Referência inválida: typeId, abilityId ou idTrainer apontam para um registro que não existe.",
            });
        }
        return;
    }

    // Prisma P2025: registro não encontrado (rede de segurança)
    if (erro.code === "P2025") {
        res.status(404).json({ error: "Registro não encontrado." });
        return;
    }

    console.error(err);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
}
