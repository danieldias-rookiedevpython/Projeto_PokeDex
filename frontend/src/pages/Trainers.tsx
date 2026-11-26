import { useCallback, useEffect, useState } from "react";
import type { TrainerDto } from "shared";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { SearchInput } from "../components/SearchInput";
import { TrainerForm } from "../components/TrainerForm";
import { listTrainers, removeTrainer } from "../services/trainerService";
import { parseApiError } from "../utils/errors";

export function Trainers() {
  const [trainers, setTrainers] = useState<TrainerDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TrainerDto | null>(null);
  const [toDelete, setToDelete] = useState<TrainerDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setTrainers(await listTrainers());
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

  // busca por texto com .filter
  const filtered = trainers.filter((t) =>
    t.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(trainer: TrainerDto) {
    setEditing(trainer);
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
      await removeTrainer(toDelete.id);
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
      <h1>Treinadores</h1>

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome..."
        />
        <button onClick={openCreate}>Novo Treinador</button>
      </div>

      {pageError && <p className="api-error" role="alert">{pageError}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum treinador encontrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Peso (kg)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.age}</td>
                <td>{t.weight}</td>
                <td className="table-actions">
                  <button onClick={() => openEdit(t)}>Editar</button>
                  <button onClick={() => setToDelete(t)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Editar Treinador" : "Novo Treinador"}
        onClose={closeModal}
      >
        <TrainerForm
          trainer={editing}
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