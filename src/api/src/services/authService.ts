import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput } from "shared";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";

const SALT_ROUNDS = 10;

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
    const senhaCorreta = usuario ? await bcrypt.compare(data.password, usuario.password) : false;

    // Mesma mensagem para e-mail inexistente e senha errada (não revela qual dos dois falhou).
    if (!usuario || !senhaCorreta) {
        throw new AppError(401, "E-mail ou senha inválidos.");
    }

    return { id: usuario.id, name: usuario.name, email: usuario.email };
}

export const authService = { cadastrar, login };
