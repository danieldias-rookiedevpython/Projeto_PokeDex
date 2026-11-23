import { isAxiosError } from "axios";

export type FieldErrors = Record<string, string>;

export function issuesToFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function parseApiError(error: unknown): {
  message: string;
  fieldErrors: FieldErrors;
} {
  if (isAxiosError(error)) {
    if (!error.response) {
      return { message: "Não foi possível conectar ao servidor.", fieldErrors: {} };
    }
    const data = error.response.data;
    return {
      message: data?.message ?? "Erro inesperado.",
      fieldErrors: data?.errors ?? {},
    };
  }
  return { message: "Erro inesperado.", fieldErrors: {} };
}