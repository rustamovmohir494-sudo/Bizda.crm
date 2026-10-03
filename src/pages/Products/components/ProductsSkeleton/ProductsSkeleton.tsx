import "./ProductsSkeleton.css";

export default function ProductsSkeleton() {
  return (
    <div className="products-skeleton-card">
      <div className="products-skeleton-head">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {Array.from({
        length: 7,
      }).map((_, index) => (
        <div
          className="products-skeleton-row"
          key={index}
        >
          <div className="skeleton-product">
            <span className="skeleton-image" />

            <div>
              <span className="skeleton-line large" />
              <span className="skeleton-line small" />
            </div>
          </div>

          <span className="skeleton-line medium" />

          <span className="skeleton-line small" />

          <span className="skeleton-line tiny" />

          <span className="skeleton-status" />

          <span className="skeleton-line small" />

          <span className="skeleton-actions" />
        </div>
      ))}
    </div>
  );
}