export interface MenuItem {
    to: string;
    label: string;
    description: string;
}

// Ajustar quando as 4 tabelas estiverem definidas
export const menuItems: MenuItem[] = [
    { to: "/pokemons", label: "Pokémons", description: "Cadastre e gerencie os Pokémons" },
    { to: "/trainers", label: "Treinadores", description: "Cadastre e gerencie os Treinadores" },
    { to: "/types", label: "Tipos", description: "Cadastre e gerencie os tipos de Pokémon" },
];