import {
  Activity,
  ShoppingBag,
  Users,
} from "lucide-react";

import type { WeeklyReport as WeeklyReportType } from "../../../../api/dashboardApi";

import SalesChart from "../../../../components/SalesChart/SalesChart";

import "./WeeklyReport.css";

interface WeeklyReportProps {
  weeklyReport: WeeklyReportType | null;

  animatedCustomers: number;
  animatedProducts: number;
  animatedOrders: number;
}

export default function WeeklyReport({
  weeklyReport,
  animatedCustomers,
  animatedProducts,
  animatedOrders,
}: WeeklyReportProps) {
  return (
    <section className="dashboard-panel weekly-report-panel">
      <div className="weekly-report-header">
        <div>
          <h2>Report for this week</h2>

          <p>
            Store activity overview
          </p>
        </div>

        <button
          type="button"
          className="weekly-report-button"
        >
          This week
        </button>
      </div>

      <div className="weekly-mini-metrics">
        <div className="weekly-mini-metric">
          <div className="weekly-mini-icon">
            <Users size={18} />
          </div>

          <div>
            <strong>
              {animatedCustomers.toLocaleString("uz-UZ")}
            </strong>

            <span>Customers</span>
          </div>
        </div>

        <div className="weekly-mini-metric">
          <div className="weekly-mini-icon">
            <ShoppingBag size={18} />
          </div>

          <div>
            <strong>
              {animatedProducts.toLocaleString("uz-UZ")}
            </strong>

            <span>Products</span>
          </div>
        </div>

        <div className="weekly-mini-metric">
          <div className="weekly-mini-icon">
            <Activity size={18} />
          </div>

          <div>
            <strong>
              {animatedOrders.toLocaleString("uz-UZ")}
            </strong>

            <span>Orders</span>
          </div>
        </div>
      </div>

      <div className="weekly-chart">
        <SalesChart weeklyReport={weeklyReport} />
      </div>
    </section>
  );
}