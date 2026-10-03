import { apiRequest } from "./client";
import type {
  Brand,
  BrandsResponse,
} from "../types/brand";

export interface GetBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateBrandPayload {
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
}

export async function getBrands(
  params: GetBrandsParams = {},
): Promise<BrandsResponse> {
  const {
    page = 1,
    limit = 20,
    search = "",
    order = "desc",
    dateFrom = "2026-01-01",
    dateTo = "2026-12-31",
  } = params;

  const query = new URLSearchParams();

  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("order", order);

  if (search.trim()) {
    query.set("search", search.trim());
  }

  if (dateFrom) {
    query.set("dateFrom", dateFrom);
  }

  if (dateTo) {
    query.set("dateTo", dateTo);
  }

  return apiRequest<BrandsResponse>(
    `/api/admin/brands?${query.toString()}`,
    {
      method: "GET",
    },
  );
}

export async function updateBrand(
  id: string,
  payload: UpdateBrandPayload,
): Promise<Brand> {
  const response = await apiRequest<{
    success: boolean;
    data: Brand;
  }>(`/api/admin/brands/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteBrand(
  id: string,
): Promise<void> {
  await apiRequest(
    `/api/admin/brands/${id}`,
    {
      method: "DELETE",
    },
  );
}
export interface CreateBrandPayload {
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
}

export async function createBrand(
  payload: CreateBrandPayload,
): Promise<Brand> {
  const response = await apiRequest<{
    success: boolean;
    data: Brand;
  }>("/api/admin/brands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.data;
}
