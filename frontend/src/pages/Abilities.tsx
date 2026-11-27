import { useEffect, useState } from "react";
import type { AbilityDto } from "shared";
import { AbilityForm } from "../components/AbilityForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { SearchInput } from "../components/SearchInput";
import { listAbilities, removeAbility } from "../services/abilityService";
import { parseApiError } from "../utils/errors";

export function Abilities() {
  const [abilities, setAbilities] = useState<AbilityDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AbilityDto | null>(null);
  const [toDelete, setToDelete] = useState<AbilityDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    listAbilities()
      .then((data) => {
        if (ignore) return;
        setAbilities(data);
        setPageError("");
      })
      .catch((error) => {
        if (!ignore) setPageError(parseApiError(error).message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  // busca por texto com .filter
  const filtered = abilities.filter((a) =>
    a.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(ability: AbilityDto) {
    setEditing(ability);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSaved() {
    setModalOpen(false);
    reload();
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      setDeleting(true);
      await removeAbility(toDelete.id);
      setToDelete(null);
      reload();
    } catch (error) {
      // ex.: habilidade ainda usada por algum Pokémon
      setToDelete(null);
      setPageError(parseApiError(error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <h1>Habilidades</h1>

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome..." />
        <button onClick={openCreate}>Nova Habilidade</button>
      </div>

      {pageError && <p className="api-error" role="alert">{pageError}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p>Nenhuma habilidade encontrada.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.description}</td>
                <td className="table-actions">
                  <button onClick={() => openEdit(a)}>Editar</button>
                  <button onClick={() => setToDelete(a)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={modalOpen} title={editing ? "Editar Habilidade" : "Nova Habilidade"} onClose={closeModal}>
        <AbilityForm ability={editing} onSaved={handleSaved} onCancel={closeModal} />
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