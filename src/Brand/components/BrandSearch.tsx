import {
  Search,
  X,
} from "lucide-react";

interface BrandSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BrandSearch({
  value,
  onChange,
}: BrandSearchProps) {
  return (
    <div className="brand-search">
      <Search
        size={18}
        strokeWidth={2}
      />

      <input
        type="text"
        value={value}
        placeholder="Search brands..."
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      {value && (
        <button
          type="button"
          className="brand-search-clear"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

