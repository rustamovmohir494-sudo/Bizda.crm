export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  _count: {
    products: number;
  };
}

export interface BrandsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
  meta: BrandsMeta;
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
  description: string;
  logo: string;
  isActive: boolean;
}

export type UpdateBrandPayload =
  CreateBrandPayload;

export interface BrandMutationResponse {
  success: boolean;
  data: Brand;
}