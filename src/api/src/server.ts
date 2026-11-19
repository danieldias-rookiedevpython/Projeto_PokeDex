import express, { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();

const app =  express();

app.use(cors({ origin: process.env.FRONTEND_URL 
    || "http://localhost:5173"
}));
app.use(express.json());

const PORT: number = Number(process.env.PORT || 3000);

// Documentação da API Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas (Ainda serão implementadas)

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
});

//Rodando API

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse a documentação da API em http://localhost:${PORT}/docs`);
})