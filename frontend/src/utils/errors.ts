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

    const fieldErrors: FieldErrors = {};
    if (Array.isArray(data?.campos)) {
      for (const campo of data.campos) {
        if (campo?.campo && campo?.mensagem) {
          fieldErrors[String(campo.campo)] = String(campo.mensagem);
        }
      }
    } else if (data?.errors && typeof data.errors === "object") {
      Object.assign(fieldErrors, data.errors);
    }

    return {
      message: data?.error ?? data?.mensagem ?? data?.message ?? "Erro inesperado.",
      fieldErrors,
    };
  }
  return { message: "Erro inesperado.", fieldErrors: {} };
}