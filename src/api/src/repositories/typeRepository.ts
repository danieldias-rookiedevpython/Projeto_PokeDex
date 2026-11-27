import { prisma } from "../../config/prisma.js";
import type { TypeInput } from "shared";

// Repository: único lugar que conversa com o banco (Prisma).
export const typeRepository = {
    findAll: () => prisma.type.findMany({ orderBy: { id: "asc" } }),

    findById: (id: number) => prisma.type.findUnique({ where: { id } }),

    create: (data: TypeInput) => prisma.type.create({ data }),

    update: (id: number, data: TypeInput) => prisma.type.update({ where: { id }, data }),

    delete: (id: number) => prisma.type.delete({ where: { id } }),
};
