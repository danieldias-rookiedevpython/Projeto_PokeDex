export interface PokemonDto {
  id: number;
  name: string;
  description: string;
  weight: number;
  height: number;
  gender: string;
  abilityId: number;
  typeId: number;
  idTrainer: number;
}

export interface TrainerDto {
  id: number;
  name: string;
  cpf: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  userId: number;
}

export interface TypeDto {
  id: number;
  name: string;
  description: string;
}

export interface AbilityDto {
  id: number;
  name: string;
  description: string;
}