import { useState } from "react";
import type { FormEvent } from "react";
import { pokemonSchema } from "shared";
import type { PokemonDto, TrainerDto, TypeDto } from "shared";
import { createPokemon, updatePokemon } from "../services/pokemonService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

interface Props {
  pokemon: PokemonDto | null; // null = criando, preenchido = editando
  types: TypeDto[];
  trainers: TrainerDto[];
  onSaved: () => void;
  onCancel: () => void;
}

export function PokemonForm({ pokemon, types, trainers, onSaved, onCancel }: Props) {
  const [name, setName] = useState(pokemon?.name ?? "");
  const [description, setDescription] = useState(pokemon?.description ?? "");
  const [typeId, setTypeId] = useState(pokemon ? String(pokemon.typeId) : "");
  const [trainerId, setTrainerId] = useState(pokemon ? String(pokemon.trainerId) : "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiMessage, setApiMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiMessage("");

    // o select devolve texto; o schema espera número (ou undefined se vazio)
    const result = pokemonSchema.safeParse({
      name,
      description,
      typeId: typeId === "" ? undefined : Number(typeId),
      trainerId: trainerId === "" ? undefined : Number(trainerId),
    });
    if (!result.success) {
      setErrors(issuesToFieldErrors(result.error.issues));
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      if (pokemon) {
        await updatePokemon(pokemon.id, result.data);
      } else {
        await createPokemon(result.data);
      }
      onSaved();
    } catch (error) {
      // erros da API (validação, valor repetido) aparecem no campo ou no aviso
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
        id="description"
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <SelectField
        id="typeId"
        label="Tipo"
        value={typeId}
        onChange={(e) => setTypeId(e.target.value)}
        options={types.map((t) => ({ value: t.id, label: t.name }))}
        error={errors.typeId}
      />
      <SelectField
        id="trainerId"
        label="Treinador"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
        options={trainers.map((t) => ({ value: t.id, label: t.name }))}
        error={errors.trainerId}
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