import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/api/prisma/schema.prisma",
  migrations: {
    seed: "tsx src/api/prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
