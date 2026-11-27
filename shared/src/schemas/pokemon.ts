import { z } from "zod";
import { genderSchema, idSchema, positiveNumber } from "./common";

export const pokemonSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  description: z.string().min(5, "Descrição deve ter ao menos 5 caracteres"),
  weight: positiveNumber("Informe o peso", "O peso deve ser maior que zero"),
  height: positiveNumber("Informe a altura", "A altura deve ser maior que zero"),
  gender: genderSchema,
  abilityId: idSchema("Selecione uma habilidade"),
  typeId: idSchema("Selecione um tipo"),
  idTrainer: idSchema("Selecione um treinador"),
});

export type PokemonInput = z.infer<typeof pokemonSchema>;