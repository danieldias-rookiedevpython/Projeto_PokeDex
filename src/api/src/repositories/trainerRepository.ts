import { prisma } from "../../config/prisma.js";
import type { TrainerWithUserInput } from "shared";

// Repository: único lugar que conversa com o banco (Prisma).
export const trainerRepository = {
    findAll: () => prisma.trainer.findMany({ orderBy: { id: "asc" } }),

    findById: (id: number) => prisma.trainer.findUnique({ where: { id } }),

    create: (data: TrainerWithUserInput) => prisma.trainer.create({ data }),

    update: (id: number, data: TrainerWithUserInput) => prisma.trainer.update({ where: { id }, data }),

    delete: (id: number) => prisma.trainer.delete({ where: { id } }),
};
