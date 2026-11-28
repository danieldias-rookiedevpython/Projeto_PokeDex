import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../../shared/src/schemas/auth";
import { FormField } from "../components/FormField";
import { login } from "../services/authService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");

    // valida com o schema do shared antes de chamar a API
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(issuesToFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      await login(result.data);
      navigate("/");
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error);
      setErrors(fieldErrors);
      setApiMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {apiMessage && <p className="api-error" role="alert">{apiMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </main>
  );
}