import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

import {
  addProductImage,
  deleteProductImage,
  getImageUrl,
  getProductById,
  setMainProductImage,
} from "../../../api/productsApi";

import type {
  Product,
  ProductImage,
} from "../../../api/productsApi";

import MediaHeader from "./components/MediaHeader/MediaHeader";
import MediaUpload from "./components/MediaUpload/MediaUpload";
import MediaGrid from "./components/MediaGrid/MediaGrid";
import MediaSkeleton from "./components/MediaSkeleton/MediaSkeleton";
import MediaEditModal from "./components/MediaEditModal/MediaEditModal";

import "./ProductMedia.css";

export default function ProductMedia() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [images, setImages] =
    useState<ProductImage[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [previewImage, setPreviewImage] =
    useState<ProductImage | null>(null);

  const [editingImage, setEditingImage] =
    useState<ProductImage | null>(null);

  const loadProduct = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      const result =
        await getProductById(id);

      setProduct(result);
      setImages(result.images || []);
    } catch (error) {
      console.error(error);

      message.error(
        "Product media ma'lumotlarini yuklashda xatolik",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleUpload = async (
    url: string,
    alt: string,
  ) => {
    if (!id) return;

    if (!url.trim()) {
      message.warning(
        "Rasm URL manzilini kiriting",
      );
      return;
    }

    try {
      setIsUploading(true);

      const newImage =
        await addProductImage(id, {
          url: url.trim(),
          alt:
            alt.trim() ||
            product?.name ||
            "Product image",
          isMain: images.length === 0,
          sortOrder: images.length,
        });

      setImages((prev) => [
        ...prev,
        newImage,
      ]);

      message.success(
        "Rasm muvaffaqiyatli qo'shildi",
      );
    } catch (error) {
      console.error(error);

      message.error(
        "Rasm qo'shishda xatolik yuz berdi",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (
    imageId: string,
  ) => {
    if (!id) return;

    try {
      setActionId(imageId);

      await deleteProductImage(
        id,
        imageId,
      );

      setImages((prev) =>
        prev.filter(
          (image) =>
            image.id !== imageId,
        ),
      );

      if (
        previewImage?.id === imageId
      ) {
        setPreviewImage(null);
      }

      if (
        editingImage?.id === imageId
      ) {
        setEditingImage(null);
      }

      message.success(
        "Rasm o'chirildi",
      );
    } catch (error) {
      console.error(error);

      message.error(
        "Rasmni o'chirishda xatolik",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleSetMain = async (
    imageId: string,
  ) => {
    if (!id) return;

    try {
      setActionId(imageId);

      await setMainProductImage(
        id,
        imageId,
      );

      setImages((prev) =>
        prev.map((image) => ({
          ...image,
          isMain:
            image.id === imageId,
        })),
      );

      setEditingImage((prev) =>
        prev
          ? {
              ...prev,
              isMain:
                prev.id === imageId,
            }
          : null,
      );

      message.success(
        "Asosiy rasm o'zgartirildi",
      );
    } catch (error) {
      console.error(error);

      message.error(
        "Asosiy rasmni o'zgartirishda xatolik",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleEditSave = (
    imageId: string,
    data: {
      url: string;
      alt: string;
    },
  ) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === imageId
          ? {
              ...image,
              url: data.url,
              alt: data.alt,
            }
          : image,
      ),
    );

    setEditingImage(null);

    message.success(
      "Media ma'lumotlari o'zgartirildi",
    );
  };

  if (isLoading) {
    return (
      <div className="product-media-page">
        <MediaSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-media-page">
        <div className="product-media-error">
          <h2>Product topilmadi</h2>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-media-page">
      <MediaHeader
        productName={product.name}
        imageCount={images.length}
        onBack={() =>
          navigate("/products")
        }
      />

      <MediaUpload
        isUploading={isUploading}
        onUpload={handleUpload}
      />

      <MediaGrid
        images={images}
        productName={product.name}
        actionId={actionId}
        onPreview={setPreviewImage}
        onDelete={handleDelete}
        onSetMain={handleSetMain}
        onEdit={setEditingImage}
      />

      {editingImage && (
        <MediaEditModal
          image={editingImage}
          productName={product.name}
          onClose={() =>
            setEditingImage(null)
          }
          onSave={handleEditSave}
        />
      )}

      {previewImage && (
        <div
          className="media-preview-overlay"
          onClick={() =>
            setPreviewImage(null)
          }
        >
          <div
            className="media-preview-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="media-preview-close"
              onClick={() =>
                setPreviewImage(null)
              }
            >
              ×
            </button>

            <img
              src={getImageUrl(
                previewImage.url,
              )}
              alt={
                previewImage.alt ||
                product.name
              }
            />

            <div className="media-preview-info">
              <strong>
                {previewImage.alt ||
                  product.name}
              </strong>

              {previewImage.isMain && (
                <span>
                  ⭐ Main image
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}