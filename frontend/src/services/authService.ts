import type { LoginInput, RegisterInput } from "shared";
import { api } from "./api";

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    name: string;
    email: string;
  };
}

export async function login(data: LoginInput) {
  const { data: res } = await api.post<AuthResponse>("/auth/login", data);
  localStorage.setItem("token", res.token);
  localStorage.setItem("currentUser", JSON.stringify(res.usuario));
  return res;
}

export async function register(data: RegisterInput) {
  await api.post("/auth/register", data);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getCurrentUser(): AuthResponse["usuario"] | null {
  const value = localStorage.getItem("currentUser");
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthResponse["usuario"];
  } catch {
    localStorage.removeItem("currentUser");
    return null;
  }
}