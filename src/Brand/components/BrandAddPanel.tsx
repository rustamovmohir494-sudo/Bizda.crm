import {
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useState } from "react";

import { createBrand } from "../../api/brandsApi";

interface BrandAddPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function BrandAddPanel({
  isOpen,
  onClose,
  onSaved,
}: BrandAddPanelProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");
  const [logo, setLogo] = useState("");
  const [isActive, setIsActive] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setLogo("");
    setIsActive(true);
    setError(null);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Brand name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await createBrand({
        name: cleanName,
        slug: slug.trim(),
        description: description.trim(),
        logo: logo.trim(),
        isActive,
      });

      onSaved();
      resetForm();
      onClose();
    } catch (err) {
      console.error(
        "Failed to create brand:",
        err,
      );

      setError(
        "Brand yaratishda xatolik yuz berdi.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="brand-add-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <aside
        className="brand-add-panel"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="brand-add-header">
          <div>
            <span>Catalog</span>
            <h2>Add Brand</h2>
            <p>
              Create a new brand for your
              store.
            </p>
          </div>

          <button
            type="button"
            className="brand-add-close"
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="brand-add-body">
          <div className="brand-add-preview">
            <div className="brand-add-preview-logo">
              {logo.trim() ? (
                <img
                  src={logo}
                  alt={name || "Brand"}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <ImageIcon size={26} />
              )}
            </div>

            <div>
              <strong>
                {name || "New Brand"}
              </strong>

              <span>
                {slug
                  ? `/${slug}`
                  : "/brand-slug"}
              </span>
            </div>
          </div>

          <label className="brand-add-field">
            <span>Brand Name</span>

            <input
              type="text"
              value={name}
              placeholder="Apple"
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </label>

          <label className="brand-add-field">
            <span>Slug</span>

            <input
              type="text"
              value={slug}
              placeholder="apple"
              onChange={(event) =>
                setSlug(event.target.value)
              }
            />
          </label>

          <label className="brand-add-field">
            <span>Description</span>

            <textarea
              value={description}
              placeholder="Apple official products"
              rows={4}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
            />
          </label>

          <label className="brand-add-field">
            <span>Logo URL</span>

            <input
              type="text"
              value={logo}
              placeholder="https://example.com/logo.png"
              onChange={(event) =>
                setLogo(event.target.value)
              }
            />
          </label>

          <div className="brand-add-active">
            <div>
              <strong>Active</strong>

              <span>
                Show this brand in the store
              </span>
            </div>

            <button
              type="button"
              className={`brand-add-switch ${
                isActive ? "active" : ""
              }`}
              onClick={() =>
                setIsActive(
                  (previous) => !previous,
                )
              }
              aria-label="Toggle brand status"
            >
              <span />
            </button>
          </div>

          {error && (
            <div className="brand-add-error">
              {error}
            </div>
          )}
        </div>

        <div className="brand-add-footer">
          <button
            type="button"
            className="brand-add-cancel"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="brand-add-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving
              ? "Creating..."
              : "Create Brand"}
          </button>
        </div>
      </aside>
    </div>
  );
}
