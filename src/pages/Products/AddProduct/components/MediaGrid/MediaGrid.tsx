import {
  Check,
  ImageOff,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";

import {
  getImageUrl,
} from "../../../../../api/productsApi";

import type {
  ProductImage,
} from "../../../../../api/productsApi";

import "./MediaGrid.css";

interface MediaGridProps {
  images: ProductImage[];
  productName: string;
  actionId: string | null;

  onPreview: (
    image: ProductImage,
  ) => void;

  onDelete: (
    imageId: string,
  ) => void;

  onSetMain: (
    imageId: string,
  ) => void;

  onEdit: (
    image: ProductImage,
  ) => void;
}

export default function MediaGrid({
  images,
  productName,
  actionId,
  onPreview,
  onDelete,
  onSetMain,
  onEdit,
}: MediaGridProps) {
  if (!images.length) {
    return (
      <div className="media-empty">
        <div className="media-empty-icon">
          <ImageOff size={32} />
        </div>

        <h3>No images yet</h3>

        <p>
          {productName} uchun hali rasm
          qo&apos;shilmagan.
        </p>
      </div>
    );
  }

  return (
    <section className="media-grid-section">
      <div className="media-grid-title">
        <div>
          <h2>Product Images</h2>

          <p>
            Product uchun yuklangan
            barcha rasmlar
          </p>
        </div>

        <span>
          {images.length}{" "}
          {images.length === 1
            ? "image"
            : "images"}
        </span>
      </div>

      <div className="media-grid">
        {images.map((image) => {
          const isBusy =
            actionId === image.id;

          return (
            <article
              key={image.id}
              className={`media-card ${
                image.isMain
                  ? "is-main"
                  : ""
              }`}
            >
              <div
                className="media-card-image"
                onClick={() => {
                  if (!isBusy) {
                    onPreview(image);
                  }
                }}
              >
                <img
                  src={getImageUrl(
                    image.url,
                  )}
                  alt={
                    image.alt ||
                    productName
                  }
                />

                {image.isMain && (
                  <div className="main-image-badge">
                    <Star size={13} />
                    Main
                  </div>
                )}

                <div className="media-card-overlay">
                  <span>
                    Open preview
                  </span>
                </div>
              </div>

              <div className="media-card-content">
                <div className="media-card-heading">
                  <strong>
                    {image.alt ||
                      "Product image"}
                  </strong>

                  <span>
                    #{image.sortOrder + 1}
                  </span>
                </div>

                <p>
                  {productName}
                </p>
              </div>

              <div
                className="media-card-actions"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  className="media-edit-btn"
                  title="Edit image"
                  disabled={isBusy}
                  onClick={() =>
                    onEdit(image)
                  }
                >
                  Edit
                </button>

                {!image.isMain && (
                  <button
                    type="button"
                    title="Set as main"
                    disabled={isBusy}
                    onClick={() =>
                      onSetMain(
                        image.id,
                      )
                    }
                  >
                    {isBusy ? (
                      <Loader2 className="media-btn-spinner" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  className="delete-media-btn"
                  title="Delete image"
                  disabled={isBusy}
                  onClick={() =>
                    onDelete(
                      image.id,
                    )
                  }
                >
                  {isBusy ? (
                    <Loader2 className="media-btn-spinner" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}