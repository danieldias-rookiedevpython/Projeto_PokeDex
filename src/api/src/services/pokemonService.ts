import { AppError } from "../errors/AppError.js";
import { pokemonRepository } from "../repositories/pokemonRepository.js";
import type { PokemonInput } from "shared";

// Service: regras de negócio. Não conhece Express (req/res).
function listar() {
    return pokemonRepository.findAll();
}

async function buscar(id: number) {
    const item = await pokemonRepository.findById(id);
    if (!item) throw new AppError(404, "Pokémon não encontrado.");
    return item;
}

function criar(data: PokemonInput) {
    return pokemonRepository.create(data);
}

async function atualizar(id: number, data: PokemonInput) {
    await buscar(id); // lança 404 se não existir
    return pokemonRepository.update(id, data);
}

async function remover(id: number) {
    await buscar(id); // lança 404 se não existir
    await pokemonRepository.delete(id);
}

export const pokemonService = { listar, buscar, criar, atualizar, remover };
