import { AppError } from "../errors/AppError.js";

export function parseId(valor: string | undefined): number {
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(400, "O id deve ser um número inteiro positivo.");
    }
    return id;
}
