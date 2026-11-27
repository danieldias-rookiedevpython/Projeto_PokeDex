import { AppError } from "../errors/AppError.js";
import { trainerRepository } from "../repositories/trainerRepository.js";
import type { TrainerWithUserInput } from "shared";

// Service: regras de negócio. Não conhece Express (req/res).
function listar() {
    return trainerRepository.findAll();
}

async function buscar(id: number) {
    const item = await trainerRepository.findById(id);
    if (!item) throw new AppError(404, "Treinador não encontrado.");
    return item;
}

function criar(data: TrainerWithUserInput) {
    return trainerRepository.create(data);
}

async function atualizar(id: number, data: TrainerWithUserInput) {
    await buscar(id); // lança 404 se não existir
    return trainerRepository.update(id, data);
}

async function remover(id: number) {
    await buscar(id); // lança 404 se não existir
    await trainerRepository.delete(id);
}

export const trainerService = { listar, buscar, criar, atualizar, remover };
