import { Modal } from "./Modal";

interface Props {
  open: boolean;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, message, loading, onConfirm, onCancel }: Props) {
  return (
    <Modal open={open} title="Confirmar remoção" onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="button" onClick={onConfirm} disabled={loading}>
          {loading ? "Removendo..." : "Remover"}
        </button>
      </div>
    </Modal>
  );
}