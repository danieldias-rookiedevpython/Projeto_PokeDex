export interface MenuItem {
  to: string;
  label: string;
  description: string;
}

export const menuItems: MenuItem[] = [
  { to: "/pokemons", label: "Pokémons", description: "Cadastre e gerencie os Pokémons" },
  { to: "/trainers", label: "Treinadores", description: "Cadastre e gerencie os treinadores" },
  { to: "/types", label: "Tipos", description: "Cadastre e gerencie os tipos de Pokémon" },
  { to: "/abilities", label: "Habilidades", description: "Cadastre e gerencie as habilidades dos Pokémons" },
];