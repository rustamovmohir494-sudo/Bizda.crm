import {
  Search,
  X,
} from "lucide-react";

import "./ProductSearch.css";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSearch({
  value,
  onChange,
}: ProductSearchProps) {
  return (
    <div className="product-search">
      <Search
        size={19}
        className="product-search-icon"
      />

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search products..."
        type="text"
      />

      {value && (
        <button
          type="button"
          className="product-search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}