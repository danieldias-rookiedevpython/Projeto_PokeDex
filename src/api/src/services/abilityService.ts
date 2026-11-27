import { AppError } from "../errors/AppError.js";
import { abilityRepository } from "../repositories/abilityRepository.js";
import type { AbilityInput } from "shared";

// Service: regras de negócio. Não conhece Express (req/res).
function listar() {
    return abilityRepository.findAll();
}

async function buscar(id: number) {
    const item = await abilityRepository.findById(id);
    if (!item) throw new AppError(404, "Habilidade não encontrada.");
    return item;
}

function criar(data: AbilityInput) {
    return abilityRepository.create(data);
}

async function atualizar(id: number, data: AbilityInput) {
    await buscar(id); // lança 404 se não existir
    return abilityRepository.update(id, data);
}

async function remover(id: number) {
    await buscar(id); // lança 404 se não existir
    await abilityRepository.delete(id);
}

export const abilityService = { listar, buscar, criar, atualizar, remover };
