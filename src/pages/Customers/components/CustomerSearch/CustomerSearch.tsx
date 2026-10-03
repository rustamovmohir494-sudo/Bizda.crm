import { Search } from "lucide-react";

import "./CustomerSearch.css";

interface CustomerSearchProps {
  value: string;
  total: number;
  onChange: (value: string) => void;
}

export default function CustomerSearch({
  value,
  total,
  onChange,
}: CustomerSearchProps) {
  return (
    <div className="customer-search-toolbar">
      <div className="customer-search">
        <Search size={18} />

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Search customers..."
        />
      </div>

      <div className="customer-total">
        <strong>{total}</strong>

        <span>customers</span>
      </div>
    </div>
  );
}