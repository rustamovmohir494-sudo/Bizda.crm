import {
  Package,
  Star,
  Sparkles,
  TrendingUp,
  Eye,
} from "lucide-react";

import "./ProductInventory.css";

interface Props {
  stock: string;
  lowStockThreshold: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  onChange: (
    field:
      | "stock"
      | "lowStockThreshold"
      | "isActive"
      | "isFeatured"
      | "isNew"
      | "isPopular",
    value: string | boolean,
  ) => void;
}

interface StatusItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function StatusItem({
  icon,
  title,
  description,
  checked,
  onChange,
}: StatusItemProps) {
  return (
    <div className="product-status-item">
      <div className="product-status-icon">
        {icon}
      </div>

      <div className="product-status-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`product-switch ${
          checked ? "active" : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

export default function ProductInventory({
  stock,
  lowStockThreshold,
  isActive,
  isFeatured,
  isNew,
  isPopular,
  onChange,
}: Props) {
  return (
    <section className="product-inventory-card">
      <div className="product-inventory-header">
        <div>
          <h2>Inventory & Status</h2>

          <p>
            Manage stock and product visibility.
          </p>
        </div>

        <div className="product-inventory-header-icon">
          <Package size={20} />
        </div>
      </div>

      <div className="product-inventory-fields">
        <label className="product-field">
          <span>Stock</span>

          <input
            type="number"
            min="0"
            value={stock}
            onChange={(event) =>
              onChange(
                "stock",
                event.target.value,
              )
            }
            placeholder="0"
          />
        </label>

        <label className="product-field">
          <span>
            Low Stock Threshold
          </span>

          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(event) =>
              onChange(
                "lowStockThreshold",
                event.target.value,
              )
            }
            placeholder="5"
          />
        </label>
      </div>

      <div className="product-status-section">
        <div className="product-status-title">
          Product Status
        </div>

        <StatusItem
          icon={<Eye size={17} />}
          title="Active"
          description="Product is visible in the store."
          checked={isActive}
          onChange={(value) =>
            onChange("isActive", value)
          }
        />

        <StatusItem
          icon={<Star size={17} />}
          title="Featured"
          description="Show this product as featured."
          checked={isFeatured}
          onChange={(value) =>
            onChange("isFeatured", value)
          }
        />

        <StatusItem
          icon={<Sparkles size={17} />}
          title="New Product"
          description="Mark this product as new."
          checked={isNew}
          onChange={(value) =>
            onChange("isNew", value)
          }
        />

        <StatusItem
          icon={<TrendingUp size={17} />}
          title="Popular"
          description="Mark this product as popular."
          checked={isPopular}
          onChange={(value) =>
            onChange("isPopular", value)
          }
        />
      </div>
    </section>
  );
}