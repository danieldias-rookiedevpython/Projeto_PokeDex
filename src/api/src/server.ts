import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

const PORT: number = Number(process.env.PORT || 3000);

app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "API Pokédex funcionando", docs: "/docs" });
});

// Documentação da API (Swagger)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas: routes -> controllers -> services -> repositories
app.use(routes);

// Rota inexistente
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Rota não encontrada." });
});

// Tratamento de erros (sempre por último)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse a documentação da API em http://localhost:${PORT}/docs`);
});
