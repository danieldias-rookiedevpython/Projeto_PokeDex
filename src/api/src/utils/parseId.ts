import { AppError } from "../errors/AppError.js";

export function parseId(valor: string | string[] | undefined): number {
    if (Array.isArray(valor)) {
        throw new AppError(400, "O id deve ser um número inteiro positivo.");
    }
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "O id deve ser um número inteiro positivo.");
    }
    return id;
}
