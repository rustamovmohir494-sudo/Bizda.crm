import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Brand } from "../../types/brand";
import { deleteBrand } from "../../api/brandsApi";

interface BrandDeleteModalProps {
  brand: Brand | null;
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
}

export default function BrandDeleteModal({
  brand,
  onClose,
  onDeleted,
}: BrandDeleteModalProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!brand) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [brand, onClose]);

  if (!brand) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      await deleteBrand(brand.id);
      await onDeleted();

      onClose();
    } catch (err) {
      console.error(
        "Failed to delete brand:",
        err,
      );

      setError(
        "Brandni o'chirishda xatolik yuz berdi.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="brand-delete-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isDeleting
        ) {
          onClose();
        }
      }}
    >
      <div className="brand-delete-modal">
        <button
          type="button"
          className="brand-delete-close"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close"
        >
          <X size={19} />
        </button>

        <div className="brand-delete-icon">
          <AlertTriangle size={26} />
        </div>

        <h2>Delete brand?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{brand.name}</strong>?
          This action cannot be undone.
        </p>

        {error && (
          <div className="brand-edit-error">
            {error}
          </div>
        )}

        <div className="brand-delete-actions">
          <button
            type="button"
            className="brand-edit-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="brand-delete-confirm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="brand-button-spinner" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Brand
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
