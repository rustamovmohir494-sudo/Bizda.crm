import {
  Plus,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./ProductsHeader.css";

interface ProductsHeaderProps {
  total: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function ProductsHeader({
  total,
  onRefresh,
  isLoading,
}: ProductsHeaderProps) {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  return (
    <header className="products-header">
      <div className="products-header-left">
        <div>
          <h1>Products</h1>

          <p>
            Manage your products and inventory
          </p>
        </div>

        <span className="products-total">
          {total} products
        </span>
      </div>

      <div className="products-header-actions">
        <button
          type="button"
          className="products-add-button"
          onClick={handleAddProduct}
        >
          <Plus size={18} />

          Add Products
        </button>
      </div>
    </header>
  );
}