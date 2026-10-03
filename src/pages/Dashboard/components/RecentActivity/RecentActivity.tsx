import { ArrowUpRight, MoreVertical } from "lucide-react";

import "./RecentActivity.css";

interface RecentActivityProps {
  outOfStock: number;
}

export default function RecentActivity({
  outOfStock,
}: RecentActivityProps) {
  const hasOutOfStock = outOfStock > 0;

  return (
    <section className="dashboard-panel recent-activity-panel">
      <div className="recent-activity-header">
        <div>
          <h2>Recent activity</h2>

          <p>
            Latest store events
          </p>
        </div>

        <button
          type="button"
          className="recent-activity-menu"
          aria-label="Recent activity options"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="activity-empty">
        <div className="activity-icon">
          <ArrowUpRight size={24} />
        </div>

        {hasOutOfStock ? (
          <>
            <h3>
              {outOfStock} products out of stock
            </h3>

            <p>
              Some products need attention.
              Check your product inventory.
            </p>
          </>
        ) : (
          <>
            <h3>No recent activity</h3>

            <p>
              There are no new store events
              to display right now.
            </p>
          </>
        )}
      </div>
    </section>
  );
}