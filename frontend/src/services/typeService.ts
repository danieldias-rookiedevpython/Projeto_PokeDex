import type { TypeDto, TypeInput } from "shared";
import { api } from "./api";

export async function listTypes() {
  const { data } = await api.get<TypeDto[]>("/types");
  return data;
}

export async function createType(input: TypeInput) {
  const { data } = await api.post<TypeDto>("/types", input);
  return data;
}

export async function updateType(id: number, input: TypeInput) {
  const { data } = await api.put<TypeDto>(`/types/${id}`, input);
  return data;
}

export async function removeType(id: number) {
  await api.delete(`/types/${id}`);
}