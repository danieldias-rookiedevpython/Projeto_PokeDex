# Projeto PokeDex

Repositório do projeto da disciplina de Programação Avançada para Web. A proposta é simular uma Pokédex usando arquitetura REST, HTTP, React, PostgreSQL, Prisma ORM e separação de responsabilidades.

## Integrantes

- Daniel da Costa Dias / RGM: 43012884
- Igor Marinho dos Santos Siva / RGM: 44100035
- Ian Rodrigues Simões Silva / RGM: 42942471

## Banco de dados

O schema Prisma está em [`src/api/prisma/schema.prisma`](src/api/prisma/schema.prisma). Ele define as seguintes tabelas:

| Tabela | Campos | Ligações |
| --- | --- | --- |
| `pokemons` (`Pokemon`) | `id`, `name`, `description`, `weight`, `height`, `gender`, `ability id`, `type id`, `id trainer` | Cada Pokémon pertence a um treinador, um tipo e uma habilidade. |
| `trainers` (`Trainer`) | `id`, `name`, `cpf`, `age`, `weight`, `height`, `gender`, `user id` | Um treinador pode ter vários Pokémon. `user id` é apenas um campo escalar no schema atual; não há relação ou chave estrangeira declarada para `users`. |
| `Type` | `id`, `name`, `description` | Um tipo pode estar associado a vários Pokémon. |
| `Ability` | `id`, `name`, `description` | Uma habilidade pode estar associada a vários Pokémon. |
| `users` (`User`) | `id`, `name`, `email`, `password` | Não há relação declarada com as outras tabelas no schema atual. |

As relações de Pokémon são implementadas pelas chaves `pokemons."id trainer" → trainers.id`, `pokemons."type id" → "Type".id` e `pokemons."ability id" → "Ability".id`. `trainers` e `users` têm os nomes físicos indicados por `@@map`; `Type` e `Ability` usam o nome padrão gerado pelo Prisma.

O histórico mantém a migration inicial e inclui uma segunda migration que atualiza o banco para corresponder ao schema. **Atenção:** essa atualização remove a antiga tabela `"Trainer"` e adiciona colunas obrigatórias em `pokemons`; faça backup e migre os dados antes de aplicá-la em um banco que já contenha registros. Ela foi aplicada localmente com as tabelas antigas vazias.

## Executar do zero

### Pré-requisitos

- Node.js e npm;
- Docker Desktop com Docker Compose;
- PostgreSQL 16 (o Compose abaixo inicia o banco em container).

Execute os comandos a seguir no PowerShell, na raiz do repositório.

### 1. Instalar dependências

```powershell
npm install
```

### 2. Subir o banco

```powershell
docker compose up -d postgres
```

O [`docker-compose.yml`](docker-compose.yml) cria o banco `pokedex` no `localhost:5432` com usuário `postgres` e senha `postgres`. Para confirmar que o container iniciou:

```powershell
docker compose ps
```

### 3. Criar o arquivo `.env`

Copie o modelo:

```powershell
Copy-Item .env.example .env
```

Confira se `.env` contém:

```dotenv
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pokedex?schema=public"
```

Esses valores correspondem à configuração local do Docker Compose. Não use essas credenciais de desenvolvimento em produção.

### 4. Criar/atualizar as tabelas

Na raiz do projeto, aplique as migrations versionadas:

```powershell
npx prisma migrate deploy
```

O Prisma usa o `prisma.config.ts` da raiz, que aponta para `src/api/prisma/schema.prisma` e lê `DATABASE_URL` do `.env`.

### 5. Executar o seed

```powershell
npx prisma db seed
```

O seed cria usuários, treinadores, tipos, habilidades e Pokémon. Ele pode ser executado novamente sem duplicar os registros.

### 6. API e frontend (etapa futura)

As etapas para iniciar a API e o frontend ainda serão implementadas. Este repositório não contém um frontend executável e o script atual da API ainda precisa ser alinhado com a localização do servidor. As credenciais abaixo são registros de desenvolvimento no banco; não há ainda uma tela ou rota de login para utilizá-las.

## Acesso ao sistema

O seed cria os seguintes usuários de desenvolvimento, todos com a mesma senha:

| E-mail | Senha |
| --- | --- |
| `ash@pokedex.com` | `PokedexDev2026!` |
| `misty@pokedex.com` | `PokedexDev2026!` |
| `brock@pokedex.com` | `PokedexDev2026!` |

As senhas são armazenadas como hashes scrypt. Use essas credenciais apenas em desenvolvimento; o fluxo de autenticação ainda será implementado junto com o back-end.
