import {
  MoreVertical,
  PackageOpen,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import type { Product } from "../../../../api/productsApi";
import { getImageUrl } from "../../../../api/productsApi";

import "./ProductTable.css";

interface ProductTableProps {
  products: Product[];

  onDelete: (
    productId: string,
  ) => Promise<void>;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price);
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
};

const getProductStatus = (
  product: Product,
) => {
  if (product.stock <= 0) {
    return "out-of-stock";
  }

  if (product.isActive === false) {
    return "inactive";
  }

  return "active";
};

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  const navigate = useNavigate();

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  const openMedia = (
    productId: string,
  ) => {
    navigate(
      `/products/media/${productId}`,
    );
  };

  /*
   * ============================================================
   * OPEN DELETE MODAL
   * ============================================================
   */

  const handleDelete = (
    event: React.MouseEvent,
    product: Product,
  ) => {
    event.stopPropagation();

    setDeleteError("");

    setDeleteProduct(product);
  };

  /*
   * ============================================================
   * CLOSE DELETE MODAL
   * ============================================================
   */

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteProduct(null);
    setDeleteError("");
  };

  /*
   * ============================================================
   * CONFIRM DELETE
   * ============================================================
   */

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      await onDelete(
        deleteProduct.id,
      );

      /*
       * Delete muvaffaqiyatli bo'lsa
       * modal yopiladi.
       */
      setDeleteProduct(null);
    } catch (error) {
      console.error(error);

      setDeleteError(
        "Mahsulotni o'chirishda xatolik yuz berdi.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * ============================================================
   * EMPTY
   * ============================================================
   */

  if (!products.length) {
    return (
      <div className="product-empty">
        <div className="product-empty-icon">
          <PackageOpen size={28} />
        </div>

        <h3>No products found</h3>

        <p>
          Try changing your search or
          add a new product.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="product-table-card">
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>SKU</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const mainImage =
                  product.images?.find(
                    (image) =>
                      image.isMain,
                  ) ??
                  product.images?.[0];

                const imageUrl =
                  getImageUrl(
                    mainImage?.url,
                  );

                const status =
                  getProductStatus(
                    product,
                  );

                return (
                  <tr
                    key={product.id}
                    className="product-row-clickable"
                    onClick={() =>
                      openMedia(
                        product.id,
                      )
                    }
                  >
                    <td>
                      <div className="product-info">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              product.name
                            }
                            className="product-image"
                            onError={(
                              event,
                            ) => {
                              event.currentTarget.style.display =
                                "none";

                              event.currentTarget.nextElementSibling?.classList.add(
                                "visible",
                              );
                            }}
                          />
                        ) : null}

                        <div
                          className={`product-image-fallback ${
                            imageUrl
                              ? ""
                              : "visible"
                          }`}
                        >
                          {getInitials(
                            product.name,
                          )}
                        </div>

                        <div className="product-name">
                          <strong>
                            {
                              product.name
                            }
                          </strong>

                          <span>
                            ID:{" "}
                            {product.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="product-category">
                        {product
                          .category
                          ?.name ??
                          "—"}
                      </span>
                    </td>

                    <td>
                      <div className="product-price">
                        <strong>
                          {formatPrice(
                            product.price,
                          )}{" "}
                          UZS
                        </strong>

                        {product.oldPrice &&
                          product.oldPrice >
                            product.price && (
                            <del>
                              {formatPrice(
                                product.oldPrice,
                              )}{" "}
                              UZS
                            </del>
                          )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`product-stock ${
                          product.stock <=
                          0
                            ? "danger"
                            : product.stock <=
                                5
                              ? "warning"
                              : ""
                        }`}
                      >
                        {
                          product.stock
                        }
                      </span>
                    </td>

                    <td>
                      <span
                        className={`product-status ${status}`}
                      >
                        <span className="status-dot" />

                        {status ===
                        "out-of-stock"
                          ? "Out of stock"
                          : status ===
                              "inactive"
                            ? "Inactive"
                            : "Active"}
                      </span>
                    </td>

                    <td>
                      <span className="product-sku">
                        {product.sku ||
                          "—"}
                      </span>
                    </td>

                    <td>
                      <div
                        className="product-actions"
                        onClick={(
                          event,
                        ) =>
                          event.stopPropagation()
                        }
                      >
                        <button
                          type="button"
                          title="Product Media"
                          onClick={() =>
                            openMedia(
                              product.id,
                            )
                          }
                        >
                          <Pencil
                            size={16}
                          />
                        </button>

                        <button
                          type="button"
                          title="Delete product"
                          onClick={(
                            event,
                          ) =>
                            handleDelete(
                              event,
                              product,
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                        <button
                          type="button"
                          title="More"
                        >
                          <MoreVertical
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {deleteProduct && (
        <div
          className="delete-modal-overlay"
          onClick={closeDeleteModal}
        >
          <div
            className="delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="delete-modal-close"
              onClick={closeDeleteModal}
              disabled={isDeleting}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="delete-modal-icon">
              <AlertTriangle
                size={25}
              />
            </div>

            <h2>
              Delete product?
            </h2>

            <p className="delete-modal-text">
              Siz ushbu productni
              o'chirmoqchisiz.
            </p>

            <div className="delete-product-preview">
              {deleteProduct.images?.length ? (
                <img
                  src={getImageUrl(
                    deleteProduct.images.find(
                      (image) =>
                        image.isMain,
                    )?.url ||
                      deleteProduct
                        .images[0]
                        ?.url,
                  )}
                  alt={
                    deleteProduct.name
                  }
                />
              ) : (
                <div className="delete-product-fallback">
                  {getInitials(
                    deleteProduct.name,
                  )}
                </div>
              )}

              <div>
                <strong>
                  {
                    deleteProduct.name
                  }
                </strong>

                <span>
                  SKU:{" "}
                  {deleteProduct.sku ||
                    "—"}
                </span>
              </div>
            </div>

            {deleteError && (
              <div className="delete-modal-error">
                {deleteError}
              </div>
            )}

            <p className="delete-modal-warning">
              Bu amalni qaytarib bo'lmaydi.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  isDeleting
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={
                  confirmDelete
                }
                disabled={
                  isDeleting
                }
              >
                {isDeleting ? (
                  <>
                    <Loader2
                      size={16}
                      className="delete-spinner"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                    />

                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}