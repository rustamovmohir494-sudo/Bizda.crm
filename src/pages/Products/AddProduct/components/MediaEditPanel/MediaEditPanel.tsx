import { useEffect, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Star,
  X,
} from "lucide-react";

import {
  getImageUrl,
} from "../../../../../api/productsApi";

import type {
  ProductImage,
} from "../../../../../api/productsApi";

import "./MediaEditPanel.css";

interface MediaEditPanelProps {
  image: ProductImage | null;
  productName: string;
  onClose: () => void;
}

export default function MediaEditPanel({
  image,
  productName,
  onClose,
}: MediaEditPanelProps) {
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (image) {
      setAlt(image.alt || "");
    }
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <>
      <div
        className="media-edit-backdrop"
        onClick={onClose}
      />

      <aside className="media-edit-panel">
        <div className="media-edit-header">
          <div>
            <span className="media-edit-eyebrow">
              Media editor
            </span>

            <h2>Edit image</h2>

            <p>
              {productName}
            </p>
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

        <div className="media-edit-content">
          <div className="media-edit-preview">
            <img
              src={getImageUrl(image.url)}
              alt={
                image.alt ||
                productName
              }
            />

            {image.isMain && (
              <div className="media-edit-main-badge">
                <Star size={13} />
                Main image
              </div>
            )}
          </div>

          <div className="media-edit-section">
            <div className="media-edit-section-title">
              <ImageIcon size={17} />

              <span>
                Image information
              </span>
            </div>

            <div className="media-edit-field">
              <label htmlFor="media-edit-alt">
                Alt text
              </label>

              <input
                id="media-edit-alt"
                type="text"
                value={alt}
                onChange={(event) =>
                  setAlt(event.target.value)
                }
                placeholder="Enter image description"
              />
            </div>

            <div className="media-edit-field">
              <label>
                Image URL
              </label>

              <div className="media-edit-url">
                {image.url}
              </div>
            </div>

            <div className="media-edit-field">
              <label>
                Position
              </label>

              <div className="media-edit-position">
                #{image.sortOrder + 1}
              </div>
            </div>
          </div>

          {image.isMain && (
            <div className="media-edit-main-info">
              <Star size={17} />

              <div>
                <strong>
                  Main product image
                </strong>

                <p>
                  This image is currently
                  displayed as the main
                  product image.
                </p>
              </div>
            </div>
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
            type="button"
            className="media-edit-save"
            onClick={onClose}
          >
            <Check size={17} />
            Done
          </button>
        </div>
      </aside>
    </>
  );
}