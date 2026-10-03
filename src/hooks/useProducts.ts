import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  deleteProduct,
  getProducts,
  type Product,
} from "../api/productsApi";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export default function useProducts(
  options: UseProductsOptions = {},
) {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(
    options.page ?? 1,
  );

  const [limit] = useState(
    options.limit ?? 10,
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadProducts = useCallback(
    async (
      requestedPage = page,
      requestedSearch =
        options.search ?? "",
    ) => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getProducts({
          page: requestedPage,
          limit,
          search: requestedSearch,
        });

        setProducts(result.products);
        setTotal(result.total);
        setPage(result.page);
      } catch (err) {
        console.error(
          "Products loading error:",
          err,
        );

        setError(
          "Mahsulotlarni yuklashda xatolik yuz berdi.",
        );

        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      limit,
      options.search,
      page,
    ],
  );

  useEffect(() => {
    loadProducts(
      page,
      options.search ?? "",
    );
  }, [
    page,
    options.search,
    loadProducts,
  ]);

  const refresh = useCallback(() => {
    return loadProducts(
      page,
      options.search ?? "",
    );
  }, [
    loadProducts,
    page,
    options.search,
  ]);

  const removeProduct = useCallback(
    async (productId: string) => {
      try {
        /*
         * Avval backenddan o'chiramiz.
         * Agar API xato bersa, pastdagi
         * setProducts ishlamaydi.
         */
        await deleteProduct(productId);

        /*
         * Backend muvaffaqiyatli o'chirgandan
         * keyin UI'dan ham darhol olib tashlaymiz.
         */
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product.id !== productId,
          ),
        );

        setTotal((prev) =>
          Math.max(0, prev - 1),
        );
      } catch (error) {
        console.error(
          "Product delete error:",
          error,
        );

        /*
         * Xatoni yuqoriga uzatamiz.
         * ProductTable modal ichida
         * xatolik ko'rsatiladi.
         */
        throw error;
      }
    },
    [],
  );

  return {
    products,
    total,
    page,
    limit,
    isLoading,
    error,
    setPage,
    refresh,
    removeProduct,
  };
}