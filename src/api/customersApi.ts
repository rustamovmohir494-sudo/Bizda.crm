import { apiRequest } from "./client";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  _count: {
    orders: number;
    reviews: number;
  };

  totalOrders: number;
  totalSpent: number;
}

export interface CustomersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  meta: CustomersMeta;
}

export interface CustomerStatusResponse {
  success: boolean;
  data: Customer;
}

export async function getCustomers(
  page = 1,
  limit = 20,
): Promise<CustomersResponse> {
  const response =
    await apiRequest<CustomersResponse>(
      `/api/admin/customers?page=${page}&limit=${limit}&order=desc&dateFrom=2026-01-01&dateTo=2026-12-31`,
      {
        method: "GET",
        auth: true,
      },
    );

  return response;
}

export async function updateCustomerStatus(
  id: string,
  isActive: boolean,
): Promise<CustomerStatusResponse> {
  return apiRequest<CustomerStatusResponse>(
    `/api/admin/customers/${id}/status`,
    {
      method: "PATCH",
      auth: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive,
      }),
    },
  );
}