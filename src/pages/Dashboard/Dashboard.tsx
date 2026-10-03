import { useEffect, useState } from "react";

import {
  getDashboardKpis,
  getWeeklyReport,
} from "../../api/dashboardApi";

import type {
  DashboardKpis,
  WeeklyReport,
} from "../../api/dashboardApi";

import StatsCards from "./components/StatsCards/StatsCards";
import WeeklyReportComponent from "./components/WeeklyReport/WeeklyReport";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import DashboardSkeleton from "./components/DashboardSkeleton/DashboardSkeleton";

import { useAnimatedNumber } from "./hooks/useAnimatedNumber";

import "./Dashboard.css";

export default function Dashboard() {
  const [kpis, setKpis] =
    useState<DashboardKpis | null>(null);

  const [weeklyReport, setWeeklyReport] =
    useState<WeeklyReport | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          kpisData,
          weeklyData,
        ] = await Promise.all([
          getDashboardKpis("30d"),
          getWeeklyReport("this"),
        ]);

        if (!isMounted) return;

        setKpis(kpisData);
        setWeeklyReport(weeklyData);
      } catch (err) {
        if (!isMounted) return;

        console.error(
          "Dashboard error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Dashboard ma'lumotlarini yuklashda xatolik yuz berdi.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSales =
    kpis?.totalSales?.value ?? 0;

  const totalSalesChange =
    kpis?.totalSales?.changePercent ?? 0;

  const totalOrders =
    kpis?.totalOrders?.value ?? 0;

  const totalOrdersChange =
    kpis?.totalOrders?.changePercent ?? 0;

  const customers =
    weeklyReport?.stats?.customers ?? 0;

  const products =
    weeklyReport?.stats?.totalProducts ?? 0;

  const outOfStock =
    weeklyReport?.stats?.outOfStock ?? 0;

  const animatedSales =
    useAnimatedNumber(totalSales);

  const animatedOrders =
    useAnimatedNumber(totalOrders);

  const animatedCustomers =
    useAnimatedNumber(customers);

  const animatedProducts =
    useAnimatedNumber(products);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    if (value > 0) {
      return `+${value}%`;
    }

    return `${value}%`;
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-badge">
            Dashboard
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <div className="dashboard-status dashboard-status-error">
            Error
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <StatsCards
        animatedSales={animatedSales}
        totalSalesChange={totalSalesChange}
        animatedOrders={animatedOrders}
        totalOrdersChange={totalOrdersChange}
        animatedCustomers={animatedCustomers}
        formatMoney={formatMoney}
        formatPercent={formatPercent}
      />

      <div className="dashboard-grid">
        <WeeklyReportComponent
          weeklyReport={weeklyReport}
          animatedCustomers={
            animatedCustomers
          }
          animatedProducts={
            animatedProducts
          }
          animatedOrders={animatedOrders}
        />

        <RecentActivity
          outOfStock={outOfStock}
        />
      </div>
    </div>
  );
}