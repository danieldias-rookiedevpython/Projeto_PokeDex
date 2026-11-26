import type { PokemonDto, PokemonInput } from "shared";
import { api } from "./api";

export async function listPokemons() {
  const { data } = await api.get<PokemonDto[]>("/pokemons");
  return data;
}

export async function createPokemon(input: PokemonInput) {
  const { data } = await api.post<PokemonDto>("/pokemons", input);
  return data;
}

export async function updatePokemon(id: number, input: PokemonInput) {
  const { data } = await api.put<PokemonDto>(`/pokemons/${id}`, input);
  return data;
}

export async function removePokemon(id: number) {
  await api.delete(`/pokemons/${id}`);
}