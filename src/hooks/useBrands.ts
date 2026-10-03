import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getBrands,
  updateBrand,
  deleteBrand,
} from "../api/brandsApi";

import type {
  Brand,
  BrandsMeta,
  UpdateBrandPayload,
} from "../types/brand";

export function useBrands() {
  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [meta, setMeta] =
    useState<BrandsMeta>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isMutating, setIsMutating] =
    useState(false);

  /* =========================================================
     LOAD
  ========================================================= */

  const loadBrands =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await getBrands({
            page,
            limit: 20,
            search,
            order: "desc",
            dateFrom: "2026-01-01",
            dateTo: "2026-12-31",
          });

        setBrands(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error(
          "Failed to load brands:",
          err,
        );

        setBrands([]);

        setError(
          "Brandlarni yuklashda xatolik yuz berdi.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [page, search]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (
    nextPage: number,
  ) => {
    if (
      nextPage < 1 ||
      nextPage > meta.totalPages
    ) {
      return;
    }

    setPage(nextPage);
  };

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdateBrand =
    useCallback(
      async (
        id: string,
        payload: UpdateBrandPayload,
      ) => {
        try {
          setIsMutating(true);

          await updateBrand(
            id,
            payload,
          );

          await loadBrands();

          return {
            success: true,
          };
        } catch (err) {
          console.error(
            "Failed to update brand:",
            err,
          );

          throw err;
        } finally {
          setIsMutating(false);
        }
      },
      [loadBrands],
    );

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDeleteBrand =
    useCallback(
      async (id: string) => {
        try {
          setIsMutating(true);

          await deleteBrand(id);

          await loadBrands();

          return {
            success: true,
          };
        } catch (err) {
          console.error(
            "Failed to delete brand:",
            err,
          );

          throw err;
        } finally {
          setIsMutating(false);
        }
      },
      [loadBrands],
    );

  return {
    brands,
    meta,
    search,
    page,

    isLoading,
    isMutating,
    error,

    handleSearch,
    handlePageChange,

    updateBrand:
      handleUpdateBrand,

    deleteBrand:
      handleDeleteBrand,

    reload: loadBrands,
  };
}