import swaggerJsdoc from "swagger-jsdoc";

const PORT = Number(process.env.PORT || 3000);

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Pokédex",
            version: "1.0.0",
            description: "API do projeto Pokédex",
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ["./src/routes/*.ts"],
});