import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getDashboardSales,
  type DashboardSales,
} from "../../api/dashboardApi";

import "./SalesChart.css";

type ChartPeriod = "daily" | "weekly" | "monthly";

interface SalesChartProps {
  weeklyReport?: unknown;
}

interface ChartItem {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export default function SalesChart({
  weeklyReport,
}: SalesChartProps) {
  const [period, setPeriod] =
    useState<ChartPeriod>("daily");

  const [sales, setSales] =
    useState<DashboardSales | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSales() {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getDashboardSales("this_year");

        if (!cancelled) {
          setSales(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Sales data yuklanmadi",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSales();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatMoney = (
    value: number,
  ) => {
    return new Intl.NumberFormat(
      "uz-UZ",
      {
        maximumFractionDigits: 0,
      },
    ).format(value);
  };

  const chartData = useMemo<ChartItem[]>(
    () => {
      if (!sales?.chart?.length) {
        return [];
      }

      const source = sales.chart;

      if (period === "daily") {
        return source.map((item) => ({
          date: item.date,
          label: new Date(
            item.date,
          ).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
          revenue: item.revenue,
          orders: item.orders,
        }));
      }

      const groups = new Map<
        string,
        ChartItem
      >();

      source.forEach((item) => {
        const date = new Date(
          item.date,
        );

        let key = "";
        let label = "";

        if (period === "weekly") {
          const firstDay =
            new Date(date);

          const day =
            firstDay.getDay();

          const diff =
            day === 0 ? -6 : 1 - day;

          firstDay.setDate(
            firstDay.getDate() + diff,
          );

          key =
            firstDay
              .toISOString()
              .split("T")[0];

          label =
            firstDay.toLocaleDateString(
              "en-US",
              {
                day: "2-digit",
                month: "short",
              },
            );
        }

        if (period === "monthly") {
          key = `${date.getFullYear()}-${String(
            date.getMonth() + 1,
          ).padStart(2, "0")}`;

          label =
            date.toLocaleDateString(
              "en-US",
              {
                month: "short",
                year: "numeric",
              },
            );
        }

        const current =
          groups.get(key);

        if (current) {
          current.revenue +=
            item.revenue;
          current.orders += item.orders;
        } else {
          groups.set(key, {
            date: key,
            label,
            revenue: item.revenue,
            orders: item.orders,
          });
        }
      });

      return Array.from(
        groups.values(),
      );
    },
    [sales, period],
  );

  const totalRevenue =
    chartData.reduce(
      (total, item) =>
        total + item.revenue,
      0,
    );

  const totalOrders =
    chartData.reduce(
      (total, item) =>
        total + item.orders,
      0,
    );

  if (isLoading) {
    return (
      <div className="sales-chart sales-chart-loading">
        <div className="sales-chart-skeleton-title" />
        <div className="sales-chart-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="sales-chart sales-chart-error">
        <div className="sales-chart-error-icon">
          !
        </div>

        <div>
          <strong>
            Sales data unavailable
          </strong>

          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return null;
  }

  return (
    <div className="sales-chart">
      <div className="sales-chart-header">
        <div className="sales-chart-heading">
          <span className="sales-chart-label">
            Revenue
          </span>

          <strong>
            {formatMoney(totalRevenue)}
          </strong>

          <span className="sales-chart-subtitle">
            {totalOrders} orders
          </span>
        </div>

        <div className="sales-chart-periods">
          <button
            type="button"
            className={
              period === "daily"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("daily")
            }
          >
            Daily
          </button>

          <button
            type="button"
            className={
              period === "weekly"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("weekly")
            }
          >
            Weekly
          </button>

          <button
            type="button"
            className={
              period === "monthly"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("monthly")
            }
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="sales-chart-divider" />

      <div className="sales-chart-wrapper">
        <ResponsiveContainer
          width="100%"
          height={280}
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 15,
              right: 12,
              left: 5,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="salesChartGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#4ea674"
                  stopOpacity={0.26}
                />

                <stop
                  offset="100%"
                  stopColor="#4ea674"
                  stopOpacity={0.015}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--chart-grid, #e8eeeb)"
              strokeDasharray="5 6"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill:
                  "var(--chart-text, #8a9a93)",
                fontSize: 12,
              }}
              minTickGap={18}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={62}
              tick={{
                fill:
                  "var(--chart-text, #8a9a93)",
                fontSize: 11,
              }}
              tickFormatter={(value) => {
                if (value === 0) {
                  return "0";
                }

                if (value >= 1000000) {
                  return `${(
                    value / 1000000
                  ).toFixed(0)}M`;
                }

                if (value >= 1000) {
                  return `${(
                    value / 1000
                  ).toFixed(0)}K`;
                }

                return value;
              }}
            />

            <Tooltip
              cursor={{
                stroke:
                  "var(--primary-color, #4ea674)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              formatter={(
                value,
              ) => [
                formatMoney(
                  Number(value),
                ),
                "Revenue",
              ]}
              labelFormatter={(label) =>
                String(label)
              }
              contentStyle={{
                borderRadius: "12px",
                border:
                  "1px solid var(--border-color, #e5ebe7)",
                background:
                  "var(--surface-color, #ffffff)",
                boxShadow:
                  "0 12px 30px rgba(0, 0, 0, 0.08)",
                padding:
                  "10px 14px",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary-color, #4ea674)"
              strokeWidth={3}
              fill="url(#salesChartGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill:
                  "var(--surface-color, #ffffff)",
                stroke:
                  "var(--primary-color, #4ea674)",
                strokeWidth: 3,
              }}
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

