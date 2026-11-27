import { prisma } from "../../config/prisma.js";
import type { AbilityInput } from "shared";

// Repository: único lugar que conversa com o banco (Prisma).
export const abilityRepository = {
    findAll: () => prisma.ability.findMany({ orderBy: { id: "asc" } }),

    findById: (id: number) => prisma.ability.findUnique({ where: { id } }),

    create: (data: AbilityInput) => prisma.ability.create({ data }),

    update: (id: number, data: AbilityInput) => prisma.ability.update({ where: { id }, data }),

    delete: (id: number) => prisma.ability.delete({ where: { id } }),
};
