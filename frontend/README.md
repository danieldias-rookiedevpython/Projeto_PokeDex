# Frontend PokéDex

Aplicação React + TypeScript + Vite para acessar a PokéDex. Inclui cadastro e login, uma área inicial com acesso aos recursos e telas para gerenciar Pokémon, treinadores, tipos e habilidades. As telas de gerenciamento exigem autenticação.

## Executar em desenvolvimento

Na raiz do repositório, instale as dependências e crie o arquivo de ambiente do frontend:

```powershell
npm install
Copy-Item frontend/.env.example frontend/.env
```

Confirme que `VITE_API_URL` aponta para a URL da API (por padrão, `http://localhost:3000`). Inicie a API e o PostgreSQL seguindo as instruções do [README principal](../README.md), depois rode o frontend:

```powershell
npm run dev --workspace=frontend
```

O Vite disponibiliza a aplicação em http://localhost:5173.

## Verificações

Execute na raiz do repositório:

```powershell
npm run build --workspace=frontend
npm run lint --workspace=frontend
```
