import {
  MoreVertical,
  ShoppingBag,
  Users,
} from "lucide-react";

import "./StatsCards.css";

interface StatsCardsProps {
  animatedSales: number;
  totalSalesChange: number;

  animatedOrders: number;
  totalOrdersChange: number;

  animatedCustomers: number;

  formatMoney: (value: number) => string;
  formatPercent: (value: number) => string;
}

export default function StatsCards({
  animatedSales,
  totalSalesChange,
  animatedOrders,
  totalOrdersChange,
  animatedCustomers,
  formatMoney,
  formatPercent,
}: StatsCardsProps) {
  return (
    <div className="stats-grid">
      {/* TOTAL SALES */}
      <div className="stat-card">
        <div className="stat-card-top">
          <div>
            <span className="stat-title">
              Total Sales
            </span>

            <span className="stat-period">
              Last 30 days
            </span>
          </div>

          <button
            type="button"
            className="stat-menu"
            aria-label="Total sales options"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="stat-value">
          {formatMoney(animatedSales)}
        </div>

        <div className="stat-bottom">
          <span
            className={
              totalSalesChange >= 0
                ? "stat-positive"
                : "stat-negative"
            }
          >
            {formatPercent(totalSalesChange)}
          </span>

          <span className="stat-description">
            vs previous period
          </span>
        </div>
      </div>

      {/* TOTAL ORDERS */}
      <div className="stat-card">
        <div className="stat-card-top">
          <div>
            <span className="stat-title">
              Total Orders
            </span>

            <span className="stat-period">
              Last 30 days
            </span>
          </div>

          <button
            type="button"
            className="stat-menu"
            aria-label="Total orders options"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="stat-value">
          {animatedOrders.toLocaleString("uz-UZ")}
        </div>

        <div className="stat-bottom">
          <span
            className={
              totalOrdersChange >= 0
                ? "stat-positive"
                : "stat-negative"
            }
          >
            {formatPercent(totalOrdersChange)}
          </span>

          <span className="stat-description">
            vs previous period
          </span>
        </div>
      </div>

      {/* CUSTOMERS */}
      <div className="stat-card">
        <div className="stat-card-top">
          <div>
            <span className="stat-title">
              Customers
            </span>

            <span className="stat-period">
              This week
            </span>
          </div>

          <div className="stat-icon">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-value">
          {animatedCustomers.toLocaleString("uz-UZ")}
        </div>

        <div className="stat-bottom">
          <span className="stat-orders-icon">
            <ShoppingBag size={15} />
          </span>

          <span className="stat-description">
            Active customers
          </span>
        </div>
      </div>
    </div>
  );
}