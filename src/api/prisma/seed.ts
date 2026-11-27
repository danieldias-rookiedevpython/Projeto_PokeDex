import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
const seedPassword = "PokedexDev2026!";

const users = [
    { name: "Ash Ketchum", email: "ash@pokedex.com" },
    { name: "Misty", email: "misty@pokedex.com" },
    { name: "Brock", email: "brock@pokedex.com" },
];

const trainers = [
    {
        name: "Ash Ketchum",
        cpf: "123.456.789-00",
        age: 10,
        weight: 40,
        height: 1.4,
        gender: "Male",
        email: "ash@pokedex.com",
    },
    {
        name: "Misty",
        cpf: "987.654.321-00",
        age: 10,
        weight: 38,
        height: 1.35,
        gender: "Female",
        email: "misty@pokedex.com",
    },
    {
        name: "Brock",
        cpf: "456.789.123-00",
        age: 15,
        weight: 55,
        height: 1.7,
        gender: "Male",
        email: "brock@pokedex.com",
    },
];

const types = [
    { name: "Electric", description: "Electric type Pokemon" },
    { name: "Grass", description: "Grass type Pokemon" },
    { name: "Fire", description: "Fire type Pokemon" },
    { name: "Water", description: "Water type Pokemon" },
    { name: "Normal", description: "Normal type Pokemon" },
    { name: "Psychic", description: "Psychic type Pokemon" },
];

const abilities = [
    {
        name: "Static",
        description: "May cause paralysis if hit by a physical move",
    },
    {
        name: "Overgrow",
        description: "Powers up Grass-type moves when the Pokemon's HP is low",
    },
    {
        name: "Blaze",
        description: "Powers up Fire-type moves when the Pokemon's HP is low",
    },
    {
        name: "Torrent",
        description: "Powers up Water-type moves when the Pokemon's HP is low",
    },
    {
        name: "Cute Charm",
        description: "May cause infatuation on contact",
    },
];

const pokemons = [
    {
        name: "Pikachu",
        description: "A small electric mouse",
        weight: 6,
        height: 0.4,
        gender: "Male",
        type: "Electric",
        ability: "Static",
        trainer: "Ash Ketchum",
    },
    {
        name: "Bulbasaur",
        description: "A small green dinosaur",
        weight: 6.9,
        height: 0.7,
        gender: "Male",
        type: "Grass",
        ability: "Overgrow",
        trainer: "Ash Ketchum",
    },
    {
        name: "Charmander",
        description: "A small fire lizard",
        weight: 8.5,
        height: 0.6,
        gender: "Male",
        type: "Fire",
        ability: "Blaze",
        trainer: "Ash Ketchum",
    },
    {
        name: "Squirtle",
        description: "A small water turtle",
        weight: 9,
        height: 0.5,
        gender: "Male",
        type: "Water",
        ability: "Torrent",
        trainer: "Misty",
    },
    {
        name: "Jigglypuff",
        description: "A small pink balloon",
        weight: 5.5,
        height: 0.5,
        gender: "Female",
        type: "Normal",
        ability: "Cute Charm",
        trainer: "Misty",
    },
    {
        name: "Meowth",
        description: "A small cat",
        weight: 4.2,
        height: 0.4,
        gender: "Male",
        type: "Normal",
        ability: "Cute Charm",
        trainer: "Brock",
    },
    {
        name: "Psyduck",
        description: "A small yellow duck",
        weight: 19.6,
        height: 0.8,
        gender: "Male",
        type: "Water",
        ability: "Torrent",
        trainer: "Misty",
    },
];

function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

async function main() {
    const userIds = new Map<string, number>();
    for (const user of users) {
        const savedUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name, password: hashPassword(seedPassword) },
            create: {
                ...user,
                password: hashPassword(seedPassword),
            },
        });
        userIds.set(user.email, savedUser.id);
    }

    const typeIds = new Map<string, number>();
    for (const type of types) {
        const savedType = await prisma.type.upsert({
            where: { name: type.name },
            update: { description: type.description },
            create: type,
        });
        typeIds.set(type.name, savedType.id);
    }

    const abilityIds = new Map<string, number>();
    for (const ability of abilities) {
        const savedAbility = await prisma.ability.upsert({
            where: { name: ability.name },
            update: { description: ability.description },
            create: ability,
        });
        abilityIds.set(ability.name, savedAbility.id);
    }

    const trainerIds = new Map<string, number>();
    for (const trainer of trainers) {
        const userId = userIds.get(trainer.email);
        if (userId === undefined) {
            throw new Error(`Seed user not found: ${trainer.email}`);
        }

        const { email, ...trainerData } = trainer;
        const savedTrainer = await prisma.trainer.upsert({
            where: { cpf: trainer.cpf },
            update: { ...trainerData, userId },
            create: { ...trainerData, userId },
        });
        trainerIds.set(trainer.name, savedTrainer.id);
    }

    for (const pokemon of pokemons) {
        const typeId = typeIds.get(pokemon.type);
        const abilityId = abilityIds.get(pokemon.ability);
        const idTrainer = trainerIds.get(pokemon.trainer);
        if (typeId === undefined || abilityId === undefined || idTrainer === undefined) {
            throw new Error(`Seed relation missing for Pokemon: ${pokemon.name}`);
        }

        const { type, ability, trainer, ...pokemonData } = pokemon;
        const relationIds = { typeId, abilityId, idTrainer };
        await prisma.pokemon.upsert({
            where: { name: pokemon.name },
            update: { ...pokemonData, ...relationIds },
            create: { ...pokemonData, ...relationIds },
        });
    }
}

try {
    await main();
} finally {
    await prisma.$disconnect();
}
