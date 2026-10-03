import { Plus, Trash2 } from "lucide-react";

import "./ProductImages.css";

export interface FormImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

interface Props {
  images: FormImage[];
  imageUrl: string;
  imageAlt: string;
  onUrlChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMain: (id: string) => void;
}

export default function ProductImages({
  images,
  imageUrl,
  imageAlt,
  onUrlChange,
  onAltChange,
  onAdd,
  onRemove,
  onMain,
}: Props) {
  return (
    <section className="product-form-card">
      <div className="product-form-card-header">
        <h2>Product Images</h2>
        <p>
          Add product image URLs. The first image can
          be used as the main image.
        </p>
      </div>

      <div className="image-add-row">
        <input
          value={imageUrl}
          onChange={(e) =>
            onUrlChange(e.target.value)
          }
          placeholder="https://example.com/product.jpg"
        />

        <input
          value={imageAlt}
          onChange={(e) =>
            onAltChange(e.target.value)
          }
          placeholder="Image alt text"
        />

        <button
          type="button"
          onClick={onAdd}
          className="add-image-btn"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {images.length === 0 ? (
        <div className="images-empty">
          <div>
            <Plus size={25} />
          </div>
          <strong>No images added</strong>
          <span>
            Add an image URL above to preview it here.
          </span>
        </div>
      ) : (
        <div className="form-images-grid">
          {images.map((image) => (
            <div
              className={`form-image-card ${
                image.isMain ? "main" : ""
              }`}
              key={image.id}
            >
              <div className="form-image-preview">
                <img
                  src={image.url}
                  alt={image.alt}
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

                {image.isMain && (
                  <span className="main-image-badge">
                    Main
                  </span>
                )}
              </div>

              <div className="form-image-actions">
                <button
                  type="button"
                  className="main-btn"
                  onClick={() =>
                    onMain(image.id)
                  }
                >
                  {image.isMain
                    ? "Main Image"
                    : "Set Main"}
                </button>

                <button
                  type="button"
                  className="delete-image-btn"
                  onClick={() =>
                    onRemove(image.id)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}