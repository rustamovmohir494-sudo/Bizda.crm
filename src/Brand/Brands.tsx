import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import BrandSearch from "./components/BrandSearch";
import BrandTable from "./components/BrandTable";
import BrandEditPanel from "./components/BrandEditPanel";
import BrandDeleteModal from "./components/BrandDeleteModal";
import BrandAddPanel from "./components/BrandAddPanel";

import { useBrands } from "../hooks/useBrands";
import type { Brand } from "../types/brand";

import "./Brands.css";

export default function Brands() {
  const {
    brands,
    meta,
    search,
    page,
    isLoading,
    error,
    handleSearch,
    handlePageChange,
    reload,
  } = useBrands();

  const [editingBrand, setEditingBrand] =
    useState<Brand | null>(null);

  const [deletingBrand, setDeletingBrand] =
    useState<Brand | null>(null);

  const [isAddingBrand, setIsAddingBrand] =
    useState(false);

  const canGoPrevious = page > 1;

  const canGoNext =
    page < meta.totalPages;

  const handleEdit = (
    brand: Brand,
  ) => {
    setEditingBrand(brand);
  };

  const handleDelete = (
    brand: Brand,
  ) => {
    setDeletingBrand(brand);
  };

  const closeEdit = () => {
    setEditingBrand(null);
  };

  const closeDelete = () => {
    setDeletingBrand(null);
  };

  const handleAdd = () => {
    setIsAddingBrand(true);
  };

  const closeAdd = () => {
    setIsAddingBrand(false);
  };

  return (
    <div className="brands-page">
      <div className="brands-header">
        <div>
          <span className="brands-eyebrow">
            Catalog
          </span>

          <h1>Brands</h1>

          <p>
            Manage your store brands and
            their products.
          </p>
        </div>

        <div className="brands-header-actions">
          <button
            type="button"
            className="brands-add"
            onClick={handleAdd}
          >
            <Plus size={17} />
            Add Brand
          </button>

          <button
            type="button"
            className="brands-refresh"
            onClick={reload}
            disabled={isLoading}
          >
            <RefreshCw
              size={17}
              className={
                isLoading
                  ? "brands-refresh-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </div>

      <div className="brands-panel">
        <div className="brands-toolbar">
          <div>
            <h2>All Brands</h2>

            <span>
              {meta.total} brands
            </span>
          </div>

          <BrandSearch
            value={search}
            onChange={handleSearch}
          />
        </div>

        {error ? (
          <div className="brands-error">
            <div>
              <strong>
                Something went wrong
              </strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={reload}
            >
              Try again
            </button>
          </div>
        ) : (
          <BrandTable
            brands={brands}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {!isLoading &&
          !error &&
          meta.totalPages > 0 && (
            <div className="brands-pagination">
              <span>
                Page {page} of{" "}
                {meta.totalPages}
              </span>

              <div>
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={!canGoPrevious}
                  onClick={() =>
                    handlePageChange(
                      page - 1,
                    )
                  }
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={!canGoNext}
                  onClick={() =>
                    handlePageChange(
                      page + 1,
                    )
                  }
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}
      </div>

      <BrandAddPanel
        isOpen={isAddingBrand}
        onClose={closeAdd}
        onSaved={reload}
      />

      <BrandEditPanel
        brand={editingBrand}
        onClose={closeEdit}
        onSaved={reload}
      />

      <BrandDeleteModal
        brand={deletingBrand}
        onClose={closeDelete}
        onDeleted={reload}
      />
    </div>
  );
}
