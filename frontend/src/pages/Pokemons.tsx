import { useCallback, useEffect, useState } from "react";
import type { AbilityDto, PokemonDto, TrainerDto, TypeDto } from "shared";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { PokemonForm } from "../components/PokemonForm";
import { SearchInput } from "../components/SearchInput";
import { listAbilities } from "../services/abilityService";
import { listPokemons, removePokemon } from "../services/pokemonService";
import { listTrainers } from "../services/trainerService";
import { listTypes } from "../services/typeService";
import { parseApiError } from "../utils/errors";

export function Pokemons() {
  const [pokemons, setPokemons] = useState<PokemonDto[]>([]);
  const [types, setTypes] = useState<TypeDto[]>([]);
  const [abilities, setAbilities] = useState<AbilityDto[]>([]);
  const [trainers, setTrainers] = useState<TrainerDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PokemonDto | null>(null);
  const [toDelete, setToDelete] = useState<PokemonDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, t, a, tr] = await Promise.all([
        listPokemons(),
        listTypes(),
        listAbilities(),
        listTrainers(),
      ]);
      setPokemons(p);
      setTypes(t);
      setAbilities(a);
      setTrainers(tr);
      setPageError("");
    } catch (error) {
      setPageError(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // busca por texto com .filter (nome ou descrição)
  const filtered = pokemons.filter((p) => {
    const term = search.trim().toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  const typeName = (id: number) => types.find((t) => t.id === id)?.name ?? "-";
  const abilityName = (id: number) => abilities.find((a) => a.id === id)?.name ?? "-";
  const trainerName = (id: number) => trainers.find((t) => t.id === id)?.name ?? "-";

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(pokemon: PokemonDto) {
    setEditing(pokemon);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSaved() {
    setModalOpen(false);
    load();
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await removePokemon(toDelete.id);
      setToDelete(null);
      await load();
    } catch (error) {
      setToDelete(null);
      setPageError(parseApiError(error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <h1>Pokémons</h1>

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou descrição..."
        />
        <button onClick={openCreate}>Novo Pokémon</button>
      </div>

      {pageError && <p className="api-error" role="alert">{pageError}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum Pokémon encontrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Habilidade</th>
              <th>Treinador</th>
              <th>Peso / Altura</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{typeName(p.typeId)}</td>
                <td>{abilityName(p.abilityId)}</td>
                <td>{trainerName(p.idTrainer)}</td>
                <td>{p.weight} kg · {p.height} m</td>
                <td>{p.description}</td>
                <td className="table-actions">
                  <button onClick={() => openEdit(p)}>Editar</button>
                  <button onClick={() => setToDelete(p)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* o mesmo modal serve para criar e editar */}
      <Modal
        open={modalOpen}
        title={editing ? "Editar Pokémon" : "Novo Pokémon"}
        onClose={closeModal}
      >
        <PokemonForm
          pokemon={editing}
          types={types}
          abilities={abilities}
          trainers={trainers}
          onSaved={handleSaved}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        message={`Deseja remover "${toDelete?.name}"?`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}