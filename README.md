# Projeto PokéDex

Aplicação web para gerenciar uma Pokédex, desenvolvida para a disciplina de Programação Avançada para Web. O projeto é composto por frontend em React, API REST em Express e banco PostgreSQL acessado com Prisma ORM.

LINK DO VÍDEO YOUTUBE: https://youtu.be/yFHw9tAp_iI

## Funcionalidades

- Cadastro e login de usuários, com senha armazenada em hash bcrypt.
- Rotas protegidas por autenticação JWT no frontend e na API.
- Operações de criar, listar, consultar, editar e remover Pokémon, treinadores, tipos e habilidades.
- Cadastro de Pokémon relacionado a um treinador, tipo e habilidade.
- Validação compartilhada entre frontend e API com schemas Zod do pacote `shared`.
- Documentação interativa dos endpoints da API via Swagger.

## Estrutura e relacionamento das tabelas

O schema Prisma está em [`src/api/prisma/schema.prisma`](src/api/prisma/schema.prisma). A estrutura atual é:

| Tabela (modelo Prisma) | Campos | Relacionamentos |
| --- | --- | --- |
| `pokemons` (`Pokemon`) | `id`, `name`, `description`, `weight`, `height`, `gender`, `ability id`, `type id`, `id trainer` | Cada Pokémon pertence a um treinador, um tipo e uma habilidade. |
| `trainers` (`Trainer`) | `id`, `name`, `cpf`, `age`, `weight`, `height`, `gender`, `user id` | Um treinador pode ter vários Pokémon. `user id` é um campo escalar, sem relação/chave estrangeira declarada para `users`. |
| `"Type"` (`Type`) | `id`, `name`, `description` | Um tipo pode estar associado a vários Pokémon. |
| `"Ability"` (`Ability`) | `id`, `name`, `description` | Uma habilidade pode estar associada a vários Pokémon. |
| `users` (`User`) | `id`, `name`, `email`, `password` | Não há relação declarada com as outras tabelas no schema atual. |

As chaves estrangeiras de Pokémon são `pokemons."id trainer" → trainers.id`, `pokemons."type id" → "Type".id` e `pokemons."ability id" → "Ability".id`. `trainers` e `users` usam os nomes físicos definidos por `@@map`; os modelos `Type` e `Ability` usam os nomes padrão do Prisma. As migrations ficam em `src/api/prisma/migrations/`.

## Tecnologias

- Frontend: React, TypeScript, Vite e React Router.
- API: Node.js, Express e TypeScript.
- Banco: PostgreSQL 16, Prisma ORM.

## Requisitos

- Node.js e npm.
- Docker Desktop com Docker Compose.

Os comandos abaixo são para PowerShell e devem ser executados na raiz do repositório.

## Executar localmente

### 1. Instalar dependências

```powershell
npm install
```

### 2. Configurar as variáveis de ambiente da API

Crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

O exemplo já configura a API na porta `3000`, PostgreSQL local em `localhost:5432` e frontend em `http://localhost:5173`. Altere `JWT_SECRET` para um valor aleatório próprio, se necessário. As credenciais do exemplo são somente para desenvolvimento.

### 3. Iniciar o banco de dados

```powershell
docker compose up -d postgres
```

O Compose inicia PostgreSQL 16 com banco `pokedex`, usuário e senha `postgres`, exposto na porta `5432`. Consulte o estado do container com:

```powershell
docker compose ps
```

### 4. Aplicar as migrations e carregar dados de exemplo

```powershell
npx prisma migrate deploy
npx prisma db seed
```

As migrations criam/atualizam as tabelas. O seed adiciona usuários, treinadores, tipos, habilidades e Pokémon de exemplo; pode ser executado novamente sem duplicar esses registros.

> **Atenção:** a migration `20261125202000_complete_schema` remove a antiga tabela `"Trainer"` e adiciona colunas obrigatórias em Pokémon. Antes de aplicá-la em um banco que já contenha dados, faça backup e avalie a migração dos registros.

### 5. Configurar e iniciar o frontend

Crie a configuração local do frontend:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

O exemplo aponta para `http://localhost:3000`. Inicie o frontend em um terminal:

```powershell
npm run dev --workspace=frontend
```

### 6. Iniciar a API

Em outro terminal, na raiz do repositório:

```powershell
npm run dev
```

Esse comando compila o pacote compartilhado e inicia a API em modo de desenvolvimento.

## Acessos locais

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Documentação Swagger: http://localhost:3000/docs
- PostgreSQL: `localhost:5432` (banco `pokedex`)

## Usuários do seed

Os três usuários de desenvolvimento usam a mesma senha:

| E-mail | Senha |
| --- | --- |
| `ash@pokedex.com` | `PokedexDev2026!` |
| `misty@pokedex.com` | `PokedexDev2026!` |
| `brock@pokedex.com` | `PokedexDev2026!` |

Use essas credenciais apenas localmente. Também é possível criar uma conta pela tela de cadastro.

## Rotas da API

As rotas de dados exigem autenticação. O login e o cadastro são públicos; as rotas protegidas usam o token JWT obtido no login.

| Recurso | Prefixo | Operações |
| --- | --- | --- |
| Autenticação | `/auth` | `POST /register`, `POST /login` |
| Pokémon | `/pokemons` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Treinadores | `/trainers` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Tipos | `/types` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Habilidades | `/abilities` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |

## Estrutura principal

- `frontend/`: aplicação React.
- `src/api/src/`: servidor, rotas, controllers, serviços e repositórios da API.
- `src/api/prisma/`: schema, migrations e seed do Prisma.
- `shared/`: tipos e schemas de validação compartilhados pelo frontend e pela API.

## Integrantes

- Daniel da Costa Dias / RGM: 43012884
    - Responsável pela implementação schema das tabelas do banco
- Igor Marinho dos Santos Siva / RGM: 44100035
    - Responsável pelas páginas e estilização do Front-End
- Ian Rodrigues Simões Silva / RGM: 42942471
    - Responsável pela lógica e validação Back-End
