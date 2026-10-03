import { apiRequest } from "./client";

export async function getOrders<T>(): Promise<T> {
  return apiRequest<T>("/api/admin/orders", {
    method: "GET",
  });
}