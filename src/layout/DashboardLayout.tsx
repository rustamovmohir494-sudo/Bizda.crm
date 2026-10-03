import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  return (
    <div
      className={`dashboard-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (current) => !current,
          )
        }
      />

      <div className="dashboard-main">
        <Header />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}