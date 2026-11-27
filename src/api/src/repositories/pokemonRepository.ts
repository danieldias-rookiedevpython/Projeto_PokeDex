import { prisma } from "../../config/prisma.js";
import type { PokemonInput } from "shared";

// Traz o nome do treinador, do tipo e da habilidade junto com o Pokémon.
const incluirRelacoes = {
    trainer: { select: { id: true, name: true } },
    type: { select: { id: true, name: true } },
    ability: { select: { id: true, name: true } },
} as const;

// Repository: único lugar que conversa com o banco (Prisma).
export const pokemonRepository = {
    findAll: () =>
        prisma.pokemon.findMany({ include: incluirRelacoes, orderBy: { id: "asc" } }),

    findById: (id: number) =>
        prisma.pokemon.findUnique({ where: { id }, include: incluirRelacoes }),

    create: (data: PokemonInput) =>
        prisma.pokemon.create({ data, include: incluirRelacoes }),

    update: (id: number, data: PokemonInput) =>
        prisma.pokemon.update({ where: { id }, data, include: incluirRelacoes }),

    delete: (id: number) => prisma.pokemon.delete({ where: { id } }),
};
