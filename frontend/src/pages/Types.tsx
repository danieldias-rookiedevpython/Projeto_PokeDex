import { useEffect, useState } from "react";
import type { TypeDto } from "../../../shared/src/types";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { SearchInput } from "../components/SearchInput";
import { TypeForm } from "../components/TypeForm";
import { listTypes, removeType } from "../services/typeService";
import { parseApiError } from "../utils/errors";

export function Types() {
  const [types, setTypes] = useState<TypeDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TypeDto | null>(null);
  const [toDelete, setToDelete] = useState<TypeDto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    listTypes()
      .then((data) => {
        if (ignore) return;
        setTypes(data);
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
  const filtered = types.filter((t) =>
    t.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(type: TypeDto) {
    setEditing(type);
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
      await removeType(toDelete.id);
      setToDelete(null);
      reload();
    } catch (error) {
      // ex.: tipo ainda usado por algum Pokémon
      setToDelete(null);
      setPageError(parseApiError(error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <h1>Tipos</h1>

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome..." />
        <button onClick={openCreate}>Novo Tipo</button>
      </div>

      {pageError && <p className="api-error" role="alert">{pageError}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p>Nenhum tipo encontrado.</p>
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
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.description}</td>
                <td className="table-actions">
                  <button onClick={() => openEdit(t)}>Editar</button>
                  <button onClick={() => setToDelete(t)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={modalOpen} title={editing ? "Editar Tipo" : "Novo Tipo"} onClose={closeModal}>
        <TypeForm type={editing} onSaved={handleSaved} onCancel={closeModal} />
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