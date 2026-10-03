import {
  Check,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Brand } from "../../types/brand";
import {
  updateBrand,
} from "../../api/brandsApi";

interface BrandEditPanelProps {
  brand: Brand | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

type PanelSize = 50 | 75 | 100;

export default function BrandEditPanel({
  brand,
  onClose,
  onSaved,
}: BrandEditPanelProps) {
  const [panelSize, setPanelSize] =
    useState<PanelSize>(50);

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

  useEffect(() => {
    if (!brand) {
      return;
    }

    setName(brand.name || "");
    setSlug(brand.slug || "");
    setDescription(
      brand.description === "string"
        ? ""
        : brand.description || "",
    );
    setLogo(
      brand.logo === "string"
        ? ""
        : brand.logo || "",
    );
    setIsActive(brand.isActive);
    setError(null);
    setPanelSize(50);
  }, [brand]);

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

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow = "";
    };
  }, [brand, onClose]);

  if (!brand) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanSlug = slug.trim();
    const cleanDescription =
      description.trim();
    const cleanLogo = logo.trim();

    if (!cleanName) {
      setError("Brand nomini kiriting.");
      return;
    }

    if (!cleanSlug) {
      setError("Slugni kiriting.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateBrand(brand.id, {
        name: cleanName,
        slug: cleanSlug,
        description: cleanDescription,
        logo: cleanLogo,
        isActive,
      });

      await onSaved();
      onClose();
    } catch (err) {
      console.error(
        "Failed to update brand:",
        err,
      );

      setError(
        "Brandni o'zgartirishda xatolik yuz berdi.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="brand-edit-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <aside
        className={`brand-edit-panel size-${panelSize}`}
      >
        <div className="brand-edit-header">
          <div>
            <span className="brands-eyebrow">
              Brand Management
            </span>

            <h2>Edit Brand</h2>

            <p>
              Update information for{" "}
              <strong>{brand.name}</strong>
            </p>
          </div>

          <button
            type="button"
            className="brand-edit-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="brand-edit-size">
          <span>Panel size</span>

          <div>
            {[50, 75, 100].map((size) => (
              <button
                key={size}
                type="button"
                className={
                  panelSize === size
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPanelSize(
                    size as PanelSize,
                  )
                }
              >
                {size}%
              </button>
            ))}
          </div>
        </div>

        <form
          className="brand-edit-body"
          onSubmit={handleSubmit}
        >
          <div className="brand-edit-preview">
            <div className="brand-edit-logo">
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <ImageIcon size={28} />
              )}
            </div>

            <div>
              <strong>
                {name || "Brand name"}
              </strong>

              <span>
                /{slug || "brand-slug"}
              </span>
            </div>
          </div>

          <label className="brand-field">
            <span>Brand Name</span>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Apple"
              disabled={isSaving}
            />
          </label>

          <label className="brand-field">
            <span>Slug</span>

            <input
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              placeholder="apple"
              disabled={isSaving}
            />
          </label>

          <label className="brand-field">
            <span>Description</span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              placeholder="Brand description..."
              rows={5}
              disabled={isSaving}
            />
          </label>

          <label className="brand-field">
            <span>Logo URL</span>

            <input
              value={logo}
              onChange={(event) =>
                setLogo(event.target.value)
              }
              placeholder="https://..."
              disabled={isSaving}
            />
          </label>

          <div className="brand-active-field">
            <div>
              <strong>Brand status</strong>
              <span>
                {isActive
                  ? "Brand is active"
                  : "Brand is inactive"}
              </span>
            </div>

            <button
              type="button"
              className={`brand-switch ${
                isActive ? "active" : ""
              }`}
              onClick={() =>
                setIsActive(
                  (current) => !current,
                )
              }
              aria-label="Toggle brand status"
              disabled={isSaving}
            >
              <span />
            </button>
          </div>

          {error && (
            <div className="brand-edit-error">
              {error}
            </div>
          )}

          <div className="brand-edit-footer">
            <button
              type="button"
              className="brand-edit-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="brand-edit-save"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="brand-button-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
