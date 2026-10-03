import { RefreshCw, Users } from "lucide-react";

import "./CustomersHeader.css";

interface CustomersHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function CustomersHeader({
  isRefreshing,
  onRefresh,
}: CustomersHeaderProps) {
  return (
    <div className="customers-header">
      <div className="customers-heading">
        <div className="customers-heading-icon">
          <Users size={21} />
        </div>

        <div>
          <h1>Customers</h1>

          <p>
            Manage your customers and account status
          </p>
        </div>
      </div>

      <button
        type="button"
        className="customers-refresh-button"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw
          size={17}
          className={
            isRefreshing
              ? "customers-refresh-icon spinning"
              : "customers-refresh-icon"
          }
        />

        <span>Refresh</span>
      </button>
    </div>
  );
}