import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Star } from "lucide-react";

import type { ProductImage } from "../../../../../api/productsApi";
import { getImageUrl } from "../../../../../api/productsApi";

import "./MediaEditModal.css";

interface MediaEditModalProps {
  image: ProductImage | null;
  productName: string;
  onClose: () => void;
  onSave: (
    imageId: string,
    data: {
      url: string;
      alt: string;
    },
  ) => void;
}

export default function MediaEditModal({
  image,
  productName,
  onClose,
  onSave,
}: MediaEditModalProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (!image) return;

    setUrl(image.url || "");
    setAlt(image.alt || "");
  }, [image]);

  if (!image) {
    return null;
  }

  const handleSubmit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const cleanUrl = url.trim();
    const cleanAlt = alt.trim();

    if (!cleanUrl) {
      return;
    }

    onSave(image.id, {
      url: cleanUrl,
      alt: cleanAlt,
    });
  };

  return (
    <div
      className="media-edit-overlay"
      onClick={onClose}
    >
      <div
        className="media-edit-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="media-edit-header">
          <div className="media-edit-title">
            <div className="media-edit-icon">
              <ImageIcon size={19} />
            </div>

            <div>
              <h2>Edit Media</h2>

              <p>
                {productName} uchun media
              </p>
            </div>
          </div>

          <button
            type="button"
            className="media-edit-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="media-edit-preview">
          <img
            src={getImageUrl(url)}
            alt={
              alt ||
              productName ||
              "Product image"
            }
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />

          {!url && (
            <div className="media-edit-preview-empty">
              <ImageIcon size={30} />
              <span>Image preview</span>
            </div>
          )}

          {image.isMain && (
            <div className="media-edit-main-badge">
              <Star size={13} />
              Main image
            </div>
          )}
        </div>

        <form
          className="media-edit-form"
          onSubmit={handleSubmit}
        >
          <label>
            <span>
              Image URL <b>*</b>
            </span>

            <input
              type="text"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com/image.jpg"
              autoComplete="off"
            />
          </label>

          <label>
            <span>Alt text</span>

            <input
              type="text"
              value={alt}
              onChange={(event) =>
                setAlt(event.target.value)
              }
              placeholder="Product image"
              autoComplete="off"
            />
          </label>

          <div className="media-edit-meta">
            <span>
              Position #{image.sortOrder + 1}
            </span>

            {image.isMain && (
              <span className="media-edit-meta-main">
                <Star size={13} />
                Main
              </span>
            )}
          </div>

          <div className="media-edit-footer">
            <button
              type="button"
              className="media-edit-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="media-edit-save"
              disabled={!url.trim()}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}