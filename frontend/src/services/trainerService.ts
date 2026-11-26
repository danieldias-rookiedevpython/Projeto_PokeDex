import type { TrainerDto, TrainerInput } from "shared";
import { api } from "./api";

export async function listTrainers() {
  const { data } = await api.get<TrainerDto[]>("/trainers");
  return data;
}

export async function createTrainer(input: TrainerInput) {
  const { data } = await api.post<TrainerDto>("/trainers", input);
  return data;
}

export async function updateTrainer(id: number, input: TrainerInput) {
  const { data } = await api.put<TrainerDto>(`/trainers/${id}`, input);
  return data;
}

export async function removeTrainer(id: number) {
  await api.delete(`/trainers/${id}`);
}