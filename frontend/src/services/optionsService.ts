import type { TrainerDto, TypeDto } from "shared";
import { api } from "./api";

export async function listTypes() {
  const { data } = await api.get<TypeDto[]>("/types");
  return data;
}

export async function listTrainers() {
  const { data } = await api.get<TrainerDto[]>("/trainers");
  return data;
}