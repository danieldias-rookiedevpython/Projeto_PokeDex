import { z } from "zod";

export const pokemonSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  description: z.string().min(5, "Descrição deve ter ao menos 5 caracteres"),
  typeId: z
    .number({ error: "Selecione um tipo" })
    .int()
    .positive("Selecione um tipo"),
  trainerId: z
    .number({ error: "Selecione um treinador" })
    .int()
    .positive("Selecione um treinador"),
});

export type PokemonInput = z.infer<typeof pokemonSchema>;