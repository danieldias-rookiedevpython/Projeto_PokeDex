import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { trainerSchema } from "../../../shared/src/schemas/trainer";
import type { TrainerDto } from "../../../shared/src/types";
import { genderOptions } from "../config/options";
import { createTrainer, updateTrainer } from "../services/trainerService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";
import { parseNumber } from "../utils/numbers";
import { getCurrentUser } from "../services/authService";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

interface Props {
  trainer: TrainerDto | null; // null = criando, preenchido = editando
  onSaved: () => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  cpf: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
}

export function TrainerForm({ trainer, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    name: trainer?.name ?? "",
    cpf: trainer?.cpf ?? "",
    age: trainer ? String(trainer.age) : "",
    weight: trainer ? String(trainer.weight) : "",
    height: trainer ? String(trainer.height) : "",
    gender: trainer?.gender ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiMessage, setApiMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");

    const result = trainerSchema.safeParse({
      name: form.name,
      cpf: form.cpf.trim(),
      age: parseNumber(form.age),
      weight: parseNumber(form.weight),
      height: parseNumber(form.height),
      gender: form.gender || undefined,
    });
    if (!result.success) {
      setErrors(issuesToFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("Faça login novamente.");
      }
      const trainerInput = { ...result.data, userId: currentUser.id };
      if (trainer) {
        await updateTrainer(trainer.id, trainerInput);
      } else {
        await createTrainer(trainerInput);
      }
      onSaved();
    } catch (error) {
      // erros da API (ex.: CPF repetido) aparecem no campo ou no aviso
      const { message, fieldErrors } = parseApiError(error);
      setErrors(fieldErrors);
      setApiMessage(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="name" label="Nome" value={form.name} onChange={update("name")} error={errors.name} />
      <FormField id="cpf" label="CPF" placeholder="123.456.789-00" value={form.cpf} onChange={update("cpf")} error={errors.cpf} />
      <FormField id="age" label="Idade" type="number" min={1} value={form.age} onChange={update("age")} error={errors.age} />
      <FormField id="weight" label="Peso (kg)" type="number" step="any" value={form.weight} onChange={update("weight")} error={errors.weight} />
      <FormField id="height" label="Altura (m)" type="number" step="any" value={form.height} onChange={update("height")} error={errors.height} />
      <SelectField id="gender" label="Gênero" value={form.gender} onChange={update("gender")} options={genderOptions} error={errors.gender} />
      {apiMessage && <p className="api-error" role="alert">{apiMessage}</p>}
      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}