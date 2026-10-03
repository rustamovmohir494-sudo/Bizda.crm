import { PackageOpen } from "lucide-react";

import "./Sticker.css";

export default function Sticker() {
  return (
    <div className="no-data">
      <div className="no-data-icon">
        <PackageOpen size={22} />
      </div>

      <span>No data</span>
    </div>
  );
}