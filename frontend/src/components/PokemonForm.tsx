import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { pokemonSchema } from "../../../shared/src/schemas/pokemon";
import type { AbilityDto, PokemonDto, TrainerDto, TypeDto } from "../../../shared/src/types";
import { genderOptions } from "../config/options";
import { createPokemon, updatePokemon } from "../services/pokemonService";
import { issuesToFieldErrors, parseApiError } from "../utils/errors";
import type { FieldErrors } from "../utils/errors";
import { parseNumber } from "../utils/numbers";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

interface Props {
  pokemon: PokemonDto | null; // null = criando, preenchido = editando
  types: TypeDto[];
  abilities: AbilityDto[];
  trainers: TrainerDto[];
  onSaved: () => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  description: string;
  weight: string;
  height: string;
  gender: string;
  abilityId: string;
  typeId: string;
  idTrainer: string;
}

export function PokemonForm({ pokemon, types, abilities, trainers, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    name: pokemon?.name ?? "",
    description: pokemon?.description ?? "",
    weight: pokemon ? String(pokemon.weight) : "",
    height: pokemon ? String(pokemon.height) : "",
    gender: pokemon?.gender ?? "",
    abilityId: pokemon ? String(pokemon.abilityId) : "",
    typeId: pokemon ? String(pokemon.typeId) : "",
    idTrainer: pokemon ? String(pokemon.idTrainer) : "",
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

    // selects e inputs devolvem texto; o schema espera número (ou undefined se vazio)
    const result = pokemonSchema.safeParse({
      name: form.name,
      description: form.description,
      weight: parseNumber(form.weight),
      height: parseNumber(form.height),
      gender: form.gender || undefined,
      abilityId: parseNumber(form.abilityId),
      typeId: parseNumber(form.typeId),
      idTrainer: parseNumber(form.idTrainer),
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
      <FormField id="name" label="Nome" value={form.name} onChange={update("name")} error={errors.name} />
      <FormField id="description" label="Descrição" value={form.description} onChange={update("description")} error={errors.description} />
      <FormField id="weight" label="Peso (kg)" type="number" step="any" value={form.weight} onChange={update("weight")} error={errors.weight} />
      <FormField id="height" label="Altura (m)" type="number" step="any" value={form.height} onChange={update("height")} error={errors.height} />
      <SelectField id="gender" label="Gênero" value={form.gender} onChange={update("gender")} options={genderOptions} error={errors.gender} />
      <SelectField
        id="typeId"
        label="Tipo"
        value={form.typeId}
        onChange={update("typeId")}
        options={types.map((t) => ({ value: t.id, label: t.name }))}
        error={errors.typeId}
      />
      <SelectField
        id="abilityId"
        label="Habilidade"
        value={form.abilityId}
        onChange={update("abilityId")}
        options={abilities.map((a) => ({ value: a.id, label: a.name }))}
        error={errors.abilityId}
      />
      <SelectField
        id="idTrainer"
        label="Treinador"
        value={form.idTrainer}
        onChange={update("idTrainer")}
        options={trainers.map((t) => ({ value: t.id, label: t.name }))}
        error={errors.idTrainer}
      />
      {apiMessage && <p className="api-error" role="alert">{apiMessage}</p>}
      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}