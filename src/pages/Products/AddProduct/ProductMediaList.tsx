import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Image as ImageIcon,
  Loader2,
  Search,
  Star,
  X,
  Save,
  Link as LinkIcon,
} from "lucide-react";

import { message } from "antd";

import {
  addProductImage,
  deleteProductImage,
  getImageUrl,
  getProducts,
  updateProduct,
} from "../../../api/productsApi";

import type {
  Product,
  ProductImage,
} from "../../../api/productsApi";

import "./ProductMediaList.css";

interface MediaItem {
  image: ProductImage;
  product: Product;
}

export default function ProductMediaList() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null);

  const [editProductName, setEditProductName] =
    useState("");

  const [editUrl, setEditUrl] =
    useState("");

  const [editAlt, setEditAlt] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /*
   * ============================================================
   * LOAD PRODUCTS
   * ============================================================
   */

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result =
        await getProducts({
          page: 1,
          limit: 100,
        });

      setProducts(result.products);
    } catch (err) {
      console.error(
        "Product media loading error:",
        err,
      );

      setError(
        "Media ma'lumotlarini yuklashda xatolik yuz berdi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * ============================================================
   * MEDIA ITEMS
   * ============================================================
   */

  const mediaItems =
    useMemo<MediaItem[]>(() => {
      const items: MediaItem[] = [];

      products.forEach((product) => {
        product.images?.forEach((image) => {
          items.push({
            image,
            product,
          });
        });
      });

      return items;
    }, [products]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const filteredMedia =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return mediaItems;
      }

      return mediaItems.filter(
        ({ image, product }) =>
          product.name
            .toLowerCase()
            .includes(value) ||
          image.alt
            ?.toLowerCase()
            .includes(value),
      );
    }, [mediaItems, search]);

  /*
   * ============================================================
   * OPEN EDITOR
   * ============================================================
   */

  const openEditor = (
    media: MediaItem,
  ) => {
    setSelectedMedia(media);

    setEditProductName(
      media.product.name,
    );

    setEditUrl(media.image.url);

    setEditAlt(
      media.image.alt || "",
    );
  };

  /*
   * ============================================================
   * CLOSE EDITOR
   * ============================================================
   */

  const closeEditor = () => {
    if (isSaving) return;

    setSelectedMedia(null);

    setEditProductName("");

    setEditUrl("");

    setEditAlt("");
  };

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSave = async () => {
    if (!selectedMedia) return;

    const product =
      selectedMedia.product;

    const oldImage =
      selectedMedia.image;

    const cleanProductName =
      editProductName.trim();

    const cleanUrl =
      editUrl.trim();

    const cleanAlt =
      editAlt.trim();

    if (!cleanProductName) {
      message.warning(
        "Product nomini kiriting",
      );

      return;
    }

    if (!cleanUrl) {
      message.warning(
        "Image URL kiriting",
      );

      return;
    }

    try {
      setIsSaving(true);

      /*
       * ========================================================
       * 1. PRODUCT NAME UPDATE
       * ========================================================
       */

      let updatedProduct =
        product;

      if (
        cleanProductName !==
        product.name
      ) {
        updatedProduct =
          await updateProduct(
            product.id,
            {
              name: cleanProductName,
            },
          );
      }

      /*
       * ========================================================
       * 2. IMAGE UPDATE
       *
       * Backendda image uchun
       * PATCH endpoint tasdiqlanmagan.
       *
       * Shuning uchun:
       *
       * NEW IMAGE -> DELETE OLD IMAGE
       * ========================================================
       */

      let updatedImage =
        oldImage;

      if (
        cleanUrl !== oldImage.url ||
        cleanAlt !==
          (oldImage.alt || "")
      ) {
        const newImage =
          await addProductImage(
            product.id,
            {
              url: cleanUrl,
              alt:
                cleanAlt ||
                cleanProductName,
              isMain:
                oldImage.isMain,
              sortOrder:
                oldImage.sortOrder,
            },
          );

        await deleteProductImage(
          product.id,
          oldImage.id,
        );

        updatedImage = {
          ...newImage,
          id: newImage.id,
          productId: product.id,
          url: cleanUrl,
          alt:
            cleanAlt ||
            cleanProductName,
          isMain:
            oldImage.isMain,
          sortOrder:
            oldImage.sortOrder,
        };
      }

      /*
       * ========================================================
       * 3. LOCAL STATE UPDATE
       *
       * Bu juda muhim.
       *
       * Card darhol yangi:
       *
       * - product name
       * - image
       * - description
       *
       * ko'rsatadi.
       * ========================================================
       */

      setProducts((prevProducts) =>
        prevProducts.map(
          (currentProduct) => {
            if (
              currentProduct.id !==
              product.id
            ) {
              return currentProduct;
            }

            const updatedImages =
              (
                currentProduct.images ||
                []
              ).map((image) => {
                if (
                  image.id ===
                  oldImage.id
                ) {
                  return updatedImage;
                }

                return image;
              });

            /*
             * Agar image o'zgargan bo'lsa,
             * eski ID topilmasligi mumkin.
             *
             * Shuning uchun tekshiramiz.
             */

            const imageExists =
              (
                currentProduct.images ||
                []
              ).some(
                (image) =>
                  image.id ===
                  oldImage.id,
              );

            return {
              ...currentProduct,

              ...updatedProduct,

              name:
                cleanProductName,

              images: imageExists
                ? updatedImages
                : [
                    ...(currentProduct.images ||
                      []),
                    updatedImage,
                  ],
            };
          },
        ),
      );

      /*
       * ========================================================
       * 4. PANELNI YOPAMIZ
       * ========================================================
       */

      setSelectedMedia(null);

      setEditProductName("");

      setEditUrl("");

      setEditAlt("");

      message.success(
        "Product va rasm ma'lumotlari muvaffaqiyatli saqlandi",
      );
    } catch (err) {
      console.error(
        "Product media update error:",
        err,
      );

      message.error(
        "Ma'lumotlarni saqlashda xatolik yuz berdi",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <div className="media-list-page">
        <div className="media-list-loading">
          <div className="media-list-spinner">
            <Loader2 size={28} />
          </div>

          <h3>
            Loading product media...
          </h3>

          <p>
            Product rasmlari
            yuklanmoqda.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (error) {
    return (
      <div className="media-list-page">
        <div className="media-list-error">
          <div className="media-list-error-icon">
            !
          </div>

          <h3>
            Something went wrong
          </h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadProducts}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="media-list-page">
      <header className="media-list-header">
        <div>
          <span className="media-list-eyebrow">
            Product management
          </span>

          <h1>
            Product Media
          </h1>

          <p>
            Barcha product rasmlarini
            shu yerdan boshqaring.
          </p>
        </div>

        <div className="media-list-stat">
          <div className="media-list-stat-icon">
            <ImageIcon size={20} />
          </div>

          <div>
            <strong>
              {mediaItems.length}
            </strong>

            <span>
              Total images
            </span>
          </div>
        </div>
      </header>

      <div className="media-list-toolbar">
        <div className="media-list-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search product or image..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <span className="media-list-result-count">
          {filteredMedia.length} images
        </span>
      </div>

      {!filteredMedia.length ? (
        <div className="media-list-empty">
          <div className="media-list-empty-icon">
            <ImageIcon size={32} />
          </div>

          <h3>
            No media found
          </h3>

          <p>
            Hozircha ko'rsatiladigan
            rasm mavjud emas.
          </p>
        </div>
      ) : (
        <section className="media-list-grid">
          {filteredMedia.map(
            ({
              image,
              product,
            }) => (
              <article
                key={`${product.id}-${image.id}`}
                className="media-list-card"
                onClick={() =>
                  openEditor({
                    image,
                    product,
                  })
                }
              >
                <div className="media-list-image">
                  <img
                    src={getImageUrl(
                      image.url,
                    )}
                    alt={
                      image.alt ||
                      product.name
                    }
                  />

                  {image.isMain && (
                    <span className="media-list-main-badge">
                      <Star size={13} />
                      Main
                    </span>
                  )}

                  <div className="media-list-image-hover">
                    <span>
                      Open editor
                    </span>
                  </div>
                </div>

                <div className="media-list-card-info">
                  <div>
                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {image.alt ||
                        "Product image"}
                    </p>
                  </div>

                  <span className="media-list-position">
                    #
                    {image.sortOrder +
                      1}
                  </span>
                </div>

                <div className="media-list-card-footer">
                  <span>
                    Product image
                  </span>

                  {image.isMain && (
                    <strong>
                      Main image
                    </strong>
                  )}
                </div>
              </article>
            ),
          )}
        </section>
      )}

      {selectedMedia && (
        <>
          <div
            className="media-list-panel-backdrop"
            onClick={closeEditor}
          />

          <aside className="media-list-edit-panel">
            {/* HEADER */}
            <div className="media-list-panel-header">
              <div>
                <span>
                  Media editor
                </span>

                <h2>
                  Edit product
                </h2>

                <p>
                  Product va uning
                  media ma'lumotlari
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="media-list-panel-content">
              {/* PREVIEW */}
              <div className="media-list-panel-preview">
                <img
                  src={getImageUrl(
                    editUrl ||
                      selectedMedia
                        .image.url,
                  )}
                  alt={
                    editAlt ||
                    editProductName
                  }
                />

                {selectedMedia.image
                  .isMain && (
                  <span>
                    <Star size={13} />
                    Main image
                  </span>
                )}
              </div>

              {/* PRODUCT NAME */}
              <div className="media-list-panel-field">
                <label>
                  Product name
                </label>

                <input
                  className="media-list-text-input"
                  type="text"
                  value={
                    editProductName
                  }
                  onChange={(event) =>
                    setEditProductName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Product name"
                  disabled={isSaving}
                />
              </div>

              {/* IMAGE URL */}
              <div className="media-list-panel-field">
                <label>
                  Image URL
                </label>

                <div className="media-list-input-wrapper">
                  <LinkIcon
                    size={16}
                  />

                  <input
                    type="text"
                    value={editUrl}
                    onChange={(event) =>
                      setEditUrl(
                        event.target
                          .value,
                      )
                    }
                    placeholder="https://example.com/image.jpg"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="media-list-panel-field">
                <label>
                  Image description
                </label>

                <input
                  className="media-list-text-input"
                  type="text"
                  value={editAlt}
                  onChange={(event) =>
                    setEditAlt(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Product image description"
                  disabled={isSaving}
                />
              </div>

              {/* POSITION */}
              <div className="media-list-panel-field">
                <label>
                  Position
                </label>

                <div>
                  #
                  {selectedMedia.image
                    .sortOrder + 1}
                </div>
              </div>

              {/* MAIN INFO */}
              <div className="media-list-panel-info">
                <Star size={17} />

                <div>
                  <strong>
                    {selectedMedia.image
                      .isMain
                      ? "Main product image"
                      : "Product media"}
                  </strong>

                  <p>
                    Rasm product media
                    ro'yxatida mavjud.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="media-list-panel-footer">
              <button
                type="button"
                className="media-list-cancel-button"
                onClick={closeEditor}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="media-list-save-button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2
                      size={16}
                      className="media-list-button-spinner"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />

                    Save changes
                  </>
                )}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}