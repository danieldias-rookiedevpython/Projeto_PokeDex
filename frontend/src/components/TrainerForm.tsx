import { useState } from "react";
import type { FormEvent } from "react";
import { trainerSchema } from "shared";
import type { TrainerDto } from "shared";
import { createTrainer, updateTrainer } from "../services/trainerService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";
import { FormField } from "./FormField";

interface Props {
  trainer: TrainerDto | null; // null = criando, preenchido = editando
  onSaved: () => void;
  onCancel: () => void;
}

export function TrainerForm({ trainer, onSaved, onCancel }: Props) {
  const [name, setName] = useState(trainer?.name ?? "");
  const [age, setAge] = useState(trainer ? String(trainer.age) : "");
  const [weight, setWeight] = useState(trainer ? String(trainer.weight) : "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiMessage, setApiMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");

    // o input devolve texto; o schema espera número (ou undefined se vazio)
    const result = trainerSchema.safeParse({
      name,
      age: age === "" ? undefined : Number(age),
      weight: weight === "" ? undefined : Number(weight.replace(",", ".")),
    });
    if (!result.success) {
      setErrors(issuesToFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      if (trainer) {
        await updateTrainer(trainer.id, result.data);
      } else {
        await createTrainer(result.data);
      }
      onSaved();
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error);
      setErrors(fieldErrors);
      setApiMessage(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        id="name"
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <FormField
        id="age"
        label="Idade"
        type="number"
        min={1}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        error={errors.age}
      />
      <FormField
        id="weight"
        label="Peso (kg)"
        type="number"
        step="any"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        error={errors.weight}
      />
      {apiMessage && <p className="api-error" role="alert">{apiMessage}</p>}
      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}