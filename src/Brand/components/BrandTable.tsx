import {
  Package,
  Store,
} from "lucide-react";

import type { Brand } from "../../types/brand";
import BrandActions from "./BrandActions";

interface BrandTableProps {
  brands: Brand[];
  isLoading: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function BrandTable({
  brands,
  isLoading,
  onEdit,
  onDelete,
}: BrandTableProps) {
  if (isLoading) {
    return (
      <div className="brand-table">
        <div className="brand-table-loading">
          {Array.from(
            { length: 6 },
            (_, index) => (
              <div
                className="brand-skeleton-row"
                key={index}
              >
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (!brands.length) {
    return (
      <div className="brand-empty">
        <div className="brand-empty-icon">
          <Store size={28} />
        </div>

        <h3>No brands found</h3>

        <p>
          There are no brands matching
          your search.
        </p>
      </div>
    );
  }

  return (
    <div className="brand-table-wrapper">
      <table className="brand-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Description</th>
            <th>Products</th>
            <th>Status</th>
            <th>Created</th>
            <th className="brand-actions-heading">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td>
                <div className="brand-info">
                  <div className="brand-logo">
                    {brand.logo &&
                    brand.logo !== "string" ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";

                          event.currentTarget.nextElementSibling?.classList.add(
                            "visible",
                          );
                        }}
                      />
                    ) : null}

                    <span className="brand-logo-fallback">
                      <Store size={20} />
                    </span>
                  </div>

                  <div className="brand-name-wrapper">
                    <strong>
                      {brand.name}
                    </strong>

                    <span>
                      /{brand.slug}
                    </span>
                  </div>
                </div>
              </td>

              <td>
                <span className="brand-description">
                  {brand.description &&
                  brand.description !== "string"
                    ? brand.description
                    : "No description"}
                </span>
              </td>

              <td>
                <div className="brand-products">
                  <Package size={16} />

                  <span>
                    {brand._count.products}
                  </span>
                </div>
              </td>

              <td>
                <span
                  className={`brand-status ${
                    brand.isActive
                      ? "active"
                      : "inactive"
                  }`}
                >
                  <span className="brand-status-dot" />

                  {brand.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td>
                <span className="brand-date">
                  {formatDate(
                    brand.createdAt,
                  )}
                </span>
              </td>

              <td className="brand-actions-cell">
                <BrandActions
                  brand={brand}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
