import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "shared";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "pokedex-dev-secret-change-me";

async function cadastrar(data: RegisterInput) {
    const email = data.email.toLowerCase();

    if (await userRepository.findByEmail(email)) {
        throw new AppError(409, "Já existe um usuário cadastrado com este e-mail.");
    }

    const senhaHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // O repository já devolve o usuário sem o campo password.
    return userRepository.create({ name: data.name, email, password: senhaHash });
}

async function login(data: LoginInput) {
    const usuario = await userRepository.findCredentialsByEmail(data.email.toLowerCase());
    const senhaCorreta = usuario ? await bcrypt.compare(data.password, usuario.password) : fah

    // Mesma mensagem para e-mail inexistente e senha errada (não revela qual dos dois falhou).
    if (!usuario || !senhaCorreta) {
        throw new AppError(401, "E-mail ou senha inválidos.");
    }

    const publicUser = { id: usuario.id, name: usuario.name, email: usuario.email };
    const token = jwt.sign(publicUser, JWT_SECRET, { expiresIn: "8h" });
    return { token, usuario: publicUser };
}

export const authService = { cadastrar, login };
