import { z } from "zod";
import { genderSchema, positiveNumber } from "./common";

export const trainerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido (ex.: 123.456.789-00)"),
  age: z
    .number({ error: "Informe a idade" })
    .int("A idade deve ser um número inteiro")
    .min(1, "Idade inválida")
    .max(120, "Idade inválida"),
  weight: positiveNumber("Informe o peso", "O peso deve ser maior que zero"),
  height: positiveNumber("Informe a altura", "A altura deve ser maior que zero"),
  gender: genderSchema,
});

export type TrainerInput = z.infer<typeof trainerSchema>;