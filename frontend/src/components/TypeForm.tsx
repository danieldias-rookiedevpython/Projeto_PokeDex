import { useState } from "react";
import type { FormEvent } from "react";
import { typeSchema } from "../../../shared/src/schemas/type";
import type { TypeDto } from "../../../shared/src/types";
import { createType, updateType } from "../services/typeService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";
import { FormField } from "./FormField";

interface Props {
  type: TypeDto | null; // null = criando, preenchido = editando
  onSaved: () => void;
  onCancel: () => void;
}

export function TypeForm({ type, onSaved, onCancel }: Props) {
  const [name, setName] = useState(type?.name ?? "");
  const [description, setDescription] = useState(type?.description ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiMessage, setApiMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");

    const result = typeSchema.safeParse({ name, description });
    if (!result.success) {
      setErrors(issuesToFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      if (type) {
        await updateType(type.id, result.data);
      } else {
        await createType(result.data);
      }
      onSaved();
    } catch (error) {
      // erros da API (ex.: nome repetido) aparecem no campo ou no aviso
      const { message, fieldErrors } = parseApiError(error);
      setErrors(fieldErrors);
      setApiMessage(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <FormField id="description" label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} />
      {apiMessage && <p className="api-error" role="alert">{apiMessage}</p>}
      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}