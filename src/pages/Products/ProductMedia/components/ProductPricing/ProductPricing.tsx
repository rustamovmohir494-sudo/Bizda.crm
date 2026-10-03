import "./ProductPricing.css";

interface Props {
  price: string;
  oldPrice: string;
  discountPercent: string;
  onChange: (
    field: string,
    value: string,
  ) => void;
}

export default function ProductPricing({
  price,
  oldPrice,
  discountPercent,
  onChange,
}: Props) {
  return (
    <section className="product-form-card">
      <div className="product-form-card-header">
        <h2>Pricing</h2>
        <p>Set product pricing information.</p>
      </div>

      <div className="product-form-grid product-pricing-grid">
        <label className="product-field">
          <span>
            Price <b>*</b>
          </span>

          <div className="price-input">
            <span>UZS</span>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) =>
                onChange("price", e.target.value)
              }
              placeholder="14999000"
            />
          </div>
        </label>

        <label className="product-field">
          <span>Old Price</span>

          <div className="price-input">
            <span>UZS</span>

            <input
              type="number"
              min="0"
              value={oldPrice}
              onChange={(e) =>
                onChange(
                  "oldPrice",
                  e.target.value,
                )
              }
              placeholder="0"
            />
          </div>
        </label>

        <label className="product-field">
          <span>Discount Percent</span>

          <div className="price-input">
            <span>%</span>

            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) =>
                onChange(
                  "discountPercent",
                  e.target.value,
                )
              }
              placeholder="0"
            />
          </div>
        </label>
      </div>
    </section>
  );
}