import { AppError } from "../errors/AppError.js";
import { typeRepository } from "../repositories/typeRepository.js";
import type { TypeInput } from "shared";

// Service: regras de negócio. Não conhece Express (req/res).
function listar() {
    return typeRepository.findAll();
}

async function buscar(id: number) {
    const item = await typeRepository.findById(id);
    if (!item) throw new AppError(404, "Tipo não encontrado.");
    return item;
}

function criar(data: TypeInput) {
    return typeRepository.create(data);
}

async function atualizar(id: number, data: TypeInput) {
    await buscar(id); // lança 404 se não existir
    return typeRepository.update(id, data);
}

async function remover(id: number) {
    await buscar(id); // lança 404 se não existir
    await typeRepository.delete(id);
}

export const typeService = { listar, buscar, criar, atualizar, remover };
