import type { LoginInput, RegisterInput } from "shared";
import { api } from "./api";

export interface AuthResponse {
    token: string;
}

export async function login(data: LoginInput) {
    const { data: res } = await api.post<AuthResponse>("/auth/login", data);
    localStorage.setItem("token", res.token);
    return res;
}

export async function register(data: RegisterInput) {
    await api.post("/auth/register", data);
}

export function logout() {
    localStorage.removeItem("token");
}

export function isAuthenticated() {
    return !!localStorage.getItem("token");
}