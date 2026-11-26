import { z } from "zod";

export const trainerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  age: z
    .number({ error: "Informe a idade" })
    .int("A idade deve ser um número inteiro")
    .min(1, "Idade inválida")
    .max(120, "Idade inválida"),
  weight: z
    .number({ error: "Informe o peso" })
    .positive("O peso deve ser maior que zero"),
});

export type TrainerInput = z.infer<typeof trainerSchema>;