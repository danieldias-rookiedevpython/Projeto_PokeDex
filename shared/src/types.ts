export interface PokemonDto {
  id: number;
  name: string;
  description: string;
  typeId: number;
  trainerId: number;
}

export interface TypeDto {
  id: number;
  name: string;
}

export interface TrainerDto {
  id: number;
  name: string;
  age: number;
  weight: number;
}