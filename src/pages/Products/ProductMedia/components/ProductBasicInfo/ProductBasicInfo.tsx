import "./ProductBasicInfo.css";

interface Props {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode: string;

  onChange: (
    field: string,
    value: string,
  ) => void;
}

export default function ProductBasicInfo({
  name,
  slug,
  description,
  shortDescription,
  sku,
  barcode,
  onChange,
}: Props) {
  return (
    <section className="product-form-card">
      <div className="product-form-card-header">
        <div>
          <h2>Basic Information</h2>
          <p>
            Enter the main information about your
            product.
          </p>
        </div>
      </div>

      <div className="product-form-grid">
        <label className="product-field product-field-full">
          <span>
            Product Name <b>*</b>
          </span>

          <input
            value={name}
            onChange={(e) =>
              onChange("name", e.target.value)
            }
            placeholder="iPhone 15 Pro"
          />
        </label>

        <label className="product-field">
          <span>Slug</span>

          <input
            value={slug}
            onChange={(e) =>
              onChange("slug", e.target.value)
            }
            placeholder="iphone-15-pro"
          />
        </label>

        <label className="product-field">
          <span>
            SKU <b>*</b>
          </span>

          <input
            value={sku}
            onChange={(e) =>
              onChange("sku", e.target.value)
            }
            placeholder="IPH15P-256"
          />
        </label>

        <label className="product-field">
          <span>Barcode</span>

          <input
            value={barcode}
            onChange={(e) =>
              onChange("barcode", e.target.value)
            }
            placeholder="1234567890"
          />
        </label>

        <label className="product-field product-field-full">
          <span>Short Description</span>

          <input
            value={shortDescription}
            onChange={(e) =>
              onChange(
                "shortDescription",
                e.target.value,
              )
            }
            placeholder="Short product description"
          />
        </label>

        <label className="product-field product-field-full">
          <span>Description</span>

          <textarea
            value={description}
            onChange={(e) =>
              onChange(
                "description",
                e.target.value,
              )
            }
            placeholder="Describe your product..."
            rows={5}
          />
        </label>
      </div>
    </section>
  );
}