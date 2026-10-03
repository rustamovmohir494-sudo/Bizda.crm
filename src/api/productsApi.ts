import { apiRequest } from "./client";

export interface ProductImage {
  id?: string;
  productId?: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isMain: boolean;
  createdAt?: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;

  price: number;
  oldPrice?: number;
  discountPercent?: number;

  stock: number;
  lowStockThreshold?: number;

  /*
   * These are kept here only for compatibility
   * with products already returned by the backend.
   * They are NOT used when creating a product.
   */
  brandId?: string;
  categoryId?: string;
  brand?: ProductBrand;
  category?: ProductCategory;

  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;

  images?: ProductImage[];

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode: string;

  price: number;
  oldPrice: number;
  discountPercent: number;

  stock: number;
  lowStockThreshold: number;

  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;

  images: Array<{
    url: string;
    alt: string;
    isMain: boolean;
    sortOrder: number;
  }>;
}

export interface UpdateProductPayload
  extends Partial<CreateProductPayload> {
  name?: string;
}

export interface AddProductImagePayload {
  url: string;
  alt?: string;
  isMain?: boolean;
  sortOrder?: number;
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<{
  products: Product[];
  total: number;
  page: number;
  limit: number;
}> {
  const {
    page = 1,
    limit = 10,
    search = "",
    order = "desc",
  } = params;

  const query = new URLSearchParams();

  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("order", order);

  if (search.trim()) {
    query.set("search", search.trim());
  }

  const response =
    await apiRequest<ProductsResponse>(
      `/api/admin/products?${query.toString()}`,
      {
        method: "GET",
      },
    );

  return {
    products: response.data ?? [],
    total: response.total ?? 0,
    page: response.page ?? page,
    limit: response.limit ?? limit,
  };
}

export async function getProductById(
  id: string,
): Promise<Product> {
  const response =
    await apiRequest<{
      success: boolean;
      data: Product;
    }>(`/api/admin/products/${id}`, {
      method: "GET",
    });

  return response.data;
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response =
    await apiRequest<{
      success: boolean;
      data: Product;
    }>("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  return response.data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response =
    await apiRequest<{
      success: boolean;
      data: Product;
    }>(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  return response.data;
}

export async function deleteProduct(
  id: string,
): Promise<void> {
  await apiRequest(
    `/api/admin/products/${id}`,
    {
      method: "DELETE",
    },
  );
}

export async function updateProductStatus(
  id: string,
  isActive: boolean,
): Promise<Product> {
  const response =
    await apiRequest<{
      success: boolean;
      data: Product;
    }>(
      `/api/admin/products/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive,
        }),
      },
    );

  return response.data;
}

export async function addProductImage(
  productId: string,
  payload: AddProductImagePayload,
): Promise<ProductImage> {
  const response =
    await apiRequest<{
      success: boolean;
      data: ProductImage;
    }>(
      `/api/admin/products/${productId}/images`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

  return response.data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await apiRequest(
    `/api/admin/products/${productId}/images/${imageId}`,
    {
      method: "DELETE",
    },
  );
}

export async function setMainProductImage(
  productId: string,
  imageId: string,
): Promise<ProductImage> {
  const response =
    await apiRequest<{
      success: boolean;
      data: ProductImage;
    }>(
      `/api/admin/products/${productId}/images/${imageId}/main`,
      {
        method: "PATCH",
      },
    );

  return response.data;
}

export async function updateProductImagesOrder(
  productId: string,
  images: Array<{
    id: string;
    sortOrder: number;
  }>,
): Promise<ProductImage[]> {
  const response =
    await apiRequest<{
      success: boolean;
      data: ProductImage[];
    }>(
      `/api/admin/products/${productId}/images/order`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images,
        }),
      },
    );

  return response.data;
}

export function getImageUrl(
  url?: string | null,
): string {
  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  if (url.startsWith("/")) {
    return `https://oline-shop-backend.onrender.com${url}`;
  }

  return `https://oline-shop-backend.onrender.com/${url}`;
}