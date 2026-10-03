import {
  BarChart3,
  PackageOpen,
  Sparkles,
} from "lucide-react";

import "./EmptyState.css";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No data yet",
  description = "Data will appear here when your store starts receiving activity.",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-decoration decoration-one">
        <Sparkles size={18} />
      </div>

      <div className="empty-sticker">
        <div className="empty-sticker-circle">
          <PackageOpen size={48} />
        </div>

        <div className="empty-chart">
          <BarChart3 size={28} />
        </div>
      </div>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}