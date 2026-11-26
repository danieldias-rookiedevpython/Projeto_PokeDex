import { z } from "zod";

export const abilitySchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  description: z.string().min(5, "Descrição deve ter ao menos 5 caracteres"),
});

export type AbilityInput = z.infer<typeof abilitySchema>;