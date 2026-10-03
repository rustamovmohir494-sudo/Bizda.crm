import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../../api/productsApi";

import ProductBasicInfo from "./components/ProductBasicInfo/ProductBasicInfo";
import ProductPricing from "./components/ProductPricing/ProductPricing";
import ProductInventory from "./components/ProductInventory/ProductInventory";
import ProductImages from "./components/ProductImages/ProductImages";

import "./AddProduct.css";

interface FormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode: string;
  price: string;
  oldPrice: string;
  discountPercent: string;
  stock: string;
  lowStockThreshold: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
}

const initialForm: FormState = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  sku: "",
  barcode: "",
  price: "",
  oldPrice: "",
  discountPercent: "0",
  stock: "0",
  lowStockThreshold: "5",
  isActive: true,
  isFeatured: false,
  isNew: false,
  isPopular: false,
};

interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [images, setImages] = useState<
    ProductImage[]
  >([]);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (
    field: keyof FormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");

    const name = form.name.trim();

    if (!name) {
      setError("Product name kiriting.");
      return;
    }

    const price = Number(form.price);

    if (!form.price || Number.isNaN(price)) {
      setError("Product price kiriting.");
      return;
    }

    const oldPrice = form.oldPrice
      ? Number(form.oldPrice)
      : 0;

    const discountPercent =
      form.discountPercent
        ? Number(form.discountPercent)
        : 0;

    const stock = form.stock
      ? Number(form.stock)
      : 0;

    const lowStockThreshold =
      form.lowStockThreshold
        ? Number(form.lowStockThreshold)
        : 5;

    if (
      Number.isNaN(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      setError(
        "Discount 0 dan 100 gacha bo‘lishi kerak.",
      );
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError("Stock noto‘g‘ri.");
      return;
    }

    if (
      Number.isNaN(lowStockThreshold) ||
      lowStockThreshold < 0
    ) {
      setError(
        "Low stock threshold noto‘g‘ri.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await createProduct({
        name,
        slug: form.slug.trim(),
        description: form.description.trim(),
        shortDescription:
          form.shortDescription.trim(),
        sku: form.sku.trim(),
        barcode: form.barcode.trim(),

        price,
        oldPrice,
        discountPercent,

        stock,
        lowStockThreshold,

        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isPopular: form.isPopular,

        images: images.map(
          (image, index) => ({
            url: image.url,
            alt: image.alt,
            isMain:
              image.isMain ||
              (index === 0 &&
                images.every(
                  (item) => !item.isMain,
                )),
            sortOrder: index,
          }),
        ),
      });

      message.success(
        "Product muvaffaqiyatli saqlandi.",
      );

      navigate("/products");
    } catch (err) {
      console.error(
        "Product create error:",
        err,
      );

      setError(
        "Productni saqlashda xatolik yuz berdi.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <div>
          <h1>Add Product</h1>

          <p>
            Create a new product and add it
            to your store.
          </p>
        </div>

        <div className="add-product-header-actions">
          <button
            type="button"
            className="add-product-cancel"
            onClick={() =>
              navigate("/products")
            }
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-product-save"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : "Save Product"}
          </button>
        </div>
      </div>

      {error && (
        <div className="add-product-error">
          {error}
        </div>
      )}

      <div className="add-product-grid">
        <div className="add-product-main">
          <ProductBasicInfo
            name={form.name}
            slug={form.slug}
            description={form.description}
            shortDescription={
              form.shortDescription
            }
            sku={form.sku}
            barcode={form.barcode}
            onChange={handleChange}
          />

          <ProductPricing
            price={form.price}
            oldPrice={form.oldPrice}
            discountPercent={
              form.discountPercent
            }
            onChange={handleChange}
          />

          <ProductImages
            images={images}
            onChange={setImages}
          />
        </div>

        <div className="add-product-sidebar">
          <ProductInventory
            stock={form.stock}
            lowStockThreshold={
              form.lowStockThreshold
            }
            isActive={form.isActive}
            isFeatured={form.isFeatured}
            isNew={form.isNew}
            isPopular={form.isPopular}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}