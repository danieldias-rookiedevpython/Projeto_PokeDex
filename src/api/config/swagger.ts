import { z } from "zod";
import {
    abilitySchema,
    loginSchema,
    pokemonSchema,
    registerSchema,
    trainerWithUserSchema,
    typeSchema,
} from "shared";

const PORT = Number(process.env.PORT || 3000);

// Converte um schema Zod em JSON Schema: a documentação dos campos de entrada
// fica sempre igual à validação real (uma única fonte da verdade).
function deZod(schema: z.ZodType) {
    const { $schema, ...resto } = z.toJSONSchema(schema) as Record<string, unknown>;
    return resto;
}

const ref = (nome: string) => ({ $ref: `#/components/schemas/${nome}` });

const corpo = (nome: string) => ({
    required: true,
    content: { "application/json": { schema: ref(nome) } },
});

const resposta = (descricao: string, schema: object) => ({
    description: descricao,
    content: { "application/json": { schema } },
});

const respostaErro = (descricao: string) => resposta(descricao, ref("Erro"));
const respostaValidacao = resposta("Dado inválido (mensagem de cada campo)", ref("ErroValidacao"));
const semConteudo = (descricao: string) => ({ description: descricao });

const parametroId = [
    { name: "id", in: "path", required: true, schema: { type: "integer", example: 1 } },
];

const resumo = {
    type: "object",
    properties: { id: { type: "integer" }, name: { type: "string" } },
};

// Gera as 5 rotas de um CRUD (listar, buscar, criar, editar, remover).
function crud(c: {
    base: string;
    tag: string;
    plural: string;
    singular: string;
    entrada: string;
    saida: string;
    descricaoListagem?: string;
}) {
    return {
        [`/${c.base}`]: {
            get: {
                tags: [c.tag],
                summary: `Listar ${c.plural}`,
                description: c.descricaoListagem,
                responses: {
                    200: resposta(`Lista de ${c.plural}`, { type: "array", items: ref(c.saida) }),
                },
            },
            post: {
                tags: [c.tag],
                summary: `Criar ${c.singular}`,
                requestBody: corpo(c.entrada),
                responses: {
                    201: resposta(`${c.singular} criado(a)`, ref(c.saida)),
                    400: respostaValidacao,
                    409: respostaErro("Valor repetido em campo único, ou referência inválida"),
                },
            },
        },
        [`/${c.base}/{id}`]: {
            get: {
                tags: [c.tag],
                summary: `Buscar ${c.singular} por id`,
                parameters: parametroId,
                responses: {
                    200: resposta(`${c.singular} encontrado(a)`, ref(c.saida)),
                    400: respostaErro("Id inválido"),
                    404: respostaErro("Id não existe"),
                },
            },
            put: {
                tags: [c.tag],
                summary: `Editar ${c.singular}`,
                parameters: parametroId,
                requestBody: corpo(c.entrada),
                responses: {
                    200: resposta(`${c.singular} atualizado(a)`, ref(c.saida)),
                    400: respostaValidacao,
                    404: respostaErro("Id não existe"),
                    409: respostaErro("Valor repetido em campo único"),
                },
            },
            delete: {
                tags: [c.tag],
                summary: `Remover ${c.singular}`,
                parameters: parametroId,
                responses: {
                    204: semConteudo(`${c.singular} removido(a)`),
                    400: respostaErro("Id inválido"),
                    404: respostaErro("Id não existe"),
                    409: respostaErro("Existem registros ligados a este"),
                },
            },
        },
    };
}

export const swaggerSpec = {
    openapi: "3.1.0",
    info: {
        title: "API Pokédex",
        version: "1.0.0",
        description: "API do projeto Pokédex (Express + Prisma + PostgreSQL).",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [
        { name: "Pokémons" },
        { name: "Treinadores" },
        { name: "Tipos" },
        { name: "Habilidades" },
        { name: "Autenticação" },
    ],
    paths: {
        ...crud({
            base: "pokemons",
            tag: "Pokémons",
            plural: "pokémons",
            singular: "Pokémon",
            entrada: "PokemonInput",
            saida: "Pokemon",
            descricaoListagem: "Traz também o nome do treinador, do tipo e da habilidade de cada Pokémon.",
        }),
        ...crud({
            base: "trainers",
            tag: "Treinadores",
            plural: "treinadores",
            singular: "Treinador",
            entrada: "TrainerInput",
            saida: "Trainer",
        }),
        ...crud({
            base: "types",
            tag: "Tipos",
            plural: "tipos",
            singular: "Tipo",
            entrada: "TypeInput",
            saida: "Type",
        }),
        ...crud({
            base: "abilities",
            tag: "Habilidades",
            plural: "habilidades",
            singular: "Habilidade",
            entrada: "AbilityInput",
            saida: "Ability",
        }),
        "/auth/register": {
            post: {
                tags: ["Autenticação"],
                summary: "Cadastrar usuário (a senha é guardada com bcrypt)",
                requestBody: corpo("RegisterInput"),
                responses: {
                    201: resposta("Usuário criado (sem a senha)", ref("UsuarioPublico")),
                    400: respostaValidacao,
                    409: respostaErro("E-mail já cadastrado"),
                },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Autenticação"],
                summary: "Login do usuário",
                requestBody: corpo("LoginInput"),
                responses: {
                    200: resposta("Login realizado", {
                        type: "object",
                        properties: {
                            mensagem: { type: "string" },
                            usuario: ref("UsuarioPublico"),
                        },
                    }),
                    400: respostaValidacao,
                    401: respostaErro("E-mail ou senha inválidos"),
                },
            },
        },
    },
    components: {
        schemas: {
            // Entradas: geradas a partir dos schemas Zod do pacote shared
            PokemonInput: deZod(pokemonSchema),
            TrainerInput: deZod(trainerWithUserSchema),
            TypeInput: deZod(typeSchema),
            AbilityInput: deZod(abilitySchema),
            RegisterInput: deZod(registerSchema),
            LoginInput: deZod(loginSchema),

            // Saídas
            Pokemon: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    description: { type: "string" },
                    weight: { type: "number" },
                    height: { type: "number" },
                    gender: { type: "string" },
                    typeId: { type: "integer" },
                    abilityId: { type: "integer" },
                    idTrainer: { type: "integer" },
                    trainer: resumo,
                    type: resumo,
                    ability: resumo,
                },
            },
            Trainer: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    cpf: { type: "string" },
                    age: { type: "integer" },
                    weight: { type: "number" },
                    height: { type: "number" },
                    gender: { type: "string" },
                    userId: { type: "integer" },
                },
            },
            Type: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    description: { type: "string" },
                },
            },
            Ability: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    description: { type: "string" },
                },
            },
            UsuarioPublico: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    email: { type: "string" },
                },
            },
            Erro: {
                type: "object",
                properties: { error: { type: "string" } },
            },
            ErroValidacao: {
                type: "object",
                properties: {
                    error: { type: "string", example: "Dados inválidos" },
                    campos: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                campo: { type: "string", example: "name" },
                                mensagem: { type: "string", example: "Nome é obrigatório" },
                            },
                        },
                    },
                },
            },
        },
    },
};
