import { z } from "zod";

// valores iguais aos do seed do backend
export const genderSchema = z.enum(["Male", "Female"], {
  error: "Selecione o gênero",
});

export const positiveNumber = (required: string, positive: string) =>
  z.number({ error: required }).positive(positive);

export const idSchema = (message: string) =>
  z.number({ error: message }).int(message).positive(message);