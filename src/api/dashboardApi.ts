import { apiRequest } from "./client";

/* =========================
   COMMON
========================= */

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* =========================
   KPI
========================= */

export interface DashboardKpis {
  label: string;

  range: {
    from: string;
    to: string;
  };

  previousRange: {
    from: string;
    to: string;
  };

  totalSales: {
    value: number;
    previousValue: number;
    changePercent: number;
  };

  totalOrders: {
    value: number;
    previousValue: number;
    changePercent: number;
  };

  pending: {
    orders: number;
    users: number;
  };

  cancelled: {
    value: number;
    previousValue: number;
    changePercent: number;
  };
}

export async function getDashboardKpis(
  range = "30d",
): Promise<DashboardKpis> {
  const response = await apiRequest<
    ApiResponse<DashboardKpis>
  >(
    `/api/admin/dashboard/kpis?range=${range}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

/* =========================
   WEEKLY REPORT
========================= */

export interface WeeklyChartItem {
  date: string;
  day: string;
  orders: number;
  revenue: number;
  value: number;
}

export interface WeeklyReport {
  week: string;

  range: {
    from: string;
    to: string;
  };

  stats: {
    customers: number;
    totalProducts: number;
    stockProducts: number;
    outOfStock: number;
    revenue: number;
  };

  chart: {
    thisWeek: WeeklyChartItem[];
    lastWeek: WeeklyChartItem[];
    active: WeeklyChartItem[];
  };
}

export async function getWeeklyReport(
  week = "this",
): Promise<WeeklyReport> {
  const response = await apiRequest<
    ApiResponse<WeeklyReport>
  >(
    `/api/admin/dashboard/weekly-report?week=${week}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

/* =========================
   SALES
========================= */

export interface SalesChartItem {
  date: string;
  orders: number;
  revenue: number;
}

export interface DashboardSales {
  range: {
    from: string;
    to: string;
  };

  revenue: number;
  orders: number;
  averageOrderValue: number;
  productsSold: number;
  newCustomers: number;
  returningCustomers: number;
  cancelledOrders: number;
  deliveredOrders: number;

  chart: SalesChartItem[];
}

export async function getDashboardSales(
  range = "30d",
): Promise<DashboardSales> {
  const response = await apiRequest<
    ApiResponse<DashboardSales>
  >(
    `/api/admin/dashboard/sales?range=${range}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

/* =========================
   SALES BY COUNTRY
========================= */

export interface SalesByCountryItem {
  name: string;
  code: string;
  sales: number;
  previousSales: number;
  changePercent: number;
  share: number;
}

export async function getSalesByCountry(): Promise<
  SalesByCountryItem[]
> {
  const response = await apiRequest<
    ApiResponse<SalesByCountryItem[]>
  >(
    "/api/admin/dashboard/sales-by-country",
    {
      method: "GET",
    },
  );

  return response.data;
}

/* =========================
   REALTIME USERS
========================= */

export interface RealtimeUserItem {
  time: string;
  users: number;
}

export interface RealtimeUsers {
  total: number;
  windowMinutes: number;
  from: string;
  to: string;
  perMinute: RealtimeUserItem[];
}

export async function getRealtimeUsers(): Promise<RealtimeUsers> {
  const response = await apiRequest<
    ApiResponse<RealtimeUsers>
  >(
    "/api/admin/dashboard/realtime-users",
    {
      method: "GET",
    },
  );

  return response.data;
}

/* =========================
   FULL DASHBOARD
========================= */

export async function getDashboardData<T>(): Promise<T> {
  return apiRequest<T>(
    "/api/admin/dashboard",
    {
      method: "GET",
    },
  );
}

