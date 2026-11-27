import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// Valida o corpo da requisição com um schema Zod.
// Se for inválido: 400 com a mensagem de cada campo.
export function validarBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body ?? {});

        if (!resultado.success) {
            res.status(400).json({
                error: "Dados inválidos",
                campos: resultado.error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    mensagem: issue.message,
                })),
            });
            return;
        }

        req.body = resultado.data; // só chegam ao controller os campos válidos
        next();
    };
}
