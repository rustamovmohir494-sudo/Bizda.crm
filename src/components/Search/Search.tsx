import { Search as SearchIcon } from "lucide-react";

import "./Search.css";

export default function Search() {
  return (
    <div className="search-component">
      <input
        type="text"
        placeholder="Search data, users, or reports"
      />

      <SearchIcon size={15} />
    </div>
  );
}