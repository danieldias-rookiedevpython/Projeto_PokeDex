import { prisma } from "../../config/prisma.js";

// A senha NUNCA sai daqui, exceto no método de login (uso interno do service).
const camposPublicos = { id: true, name: true, email: true } as const;

export const userRepository = {
    findByEmail: (email: string) =>
        prisma.user.findUnique({ where: { email }, select: camposPublicos }),

    findCredentialsByEmail: (email: string) =>
        prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, password: true },
        }),

    create: (data: { name: string; email: string; password: string }) =>
        prisma.user.create({ data, select: camposPublicos }),
};
