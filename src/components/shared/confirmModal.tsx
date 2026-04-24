import React from "react";

interface Props {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal: React.FC<Props> = ({
  title = "Confirm Delete",
  message = "Are you sure you want to delete?",
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white border-4 border-black p-6 w-[90%] max-w-md brutal-shadow">
        <h2 className="font-black text-lg mb-2">{title}</h2>
        <p className="text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="brutal-btn"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="brutal-btn brutal-btn-danger"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;