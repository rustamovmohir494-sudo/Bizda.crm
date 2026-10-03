import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import useProducts from "../../hooks/useProducts";

import ProductsHeader from "./components/ProductsHeader/ProductsHeader";
import ProductSearch from "./components/ProductSearch/ProductSearch";
import ProductTable from "./components/ProductTable/ProductTable";
import ProductsSkeleton from "./components/ProductsSkeleton/ProductsSkeleton";

import "./Products.css";

export default function Products() {
  const [search, setSearch] = useState("");

  const {
    products,
    total,
    page,
    limit,
    isLoading,
    error,
    setPage,
    refresh,
    removeProduct,
  } = useProducts({
    page: 1,
    limit: 10,
    search,
  });

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(total / limit),
    );
  }, [total, limit]);

  const handleSearch = (
    value: string,
  ) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <div className="products-page">
      <ProductsHeader
        total={total}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      <section className="products-content">
        <div className="products-toolbar">
          <ProductSearch
            value={search}
            onChange={handleSearch}
          />

          <button
            type="button"
            className="products-refresh-button"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw
              size={17}
              className={
                isLoading
                  ? "products-spin"
                  : ""
              }
            />

            <span>
              {isLoading
                ? "Loading..."
                : "Refresh"}
            </span>
          </button>
        </div>

        {isLoading ? (
          <ProductsSkeleton />
        ) : error ? (
          <div className="products-error">
            <div className="products-error-icon">
              !
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={refresh}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              onDelete={removeProduct}
            />

            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(page - 1)
                  }
                >
                  Previous
                </button>

                <div className="products-page-number">
                  <span>{page}</span>

                  <small>
                    / {totalPages}
                  </small>
                </div>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(page + 1)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}