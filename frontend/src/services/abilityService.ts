import type { AbilityDto, AbilityInput } from "shared";
import { api } from "./api";

export async function listAbilities() {
  const { data } = await api.get<AbilityDto[]>("/abilities");
  return data;
}

export async function createAbility(input: AbilityInput) {
  const { data } = await api.post<AbilityDto>("/abilities", input);
  return data;
}

export async function updateAbility(id: number, input: AbilityInput) {
  const { data } = await api.put<AbilityDto>(`/abilities/${id}`, input);
  return data;
}

export async function removeAbility(id: number) {
  await api.delete(`/abilities/${id}`);
}