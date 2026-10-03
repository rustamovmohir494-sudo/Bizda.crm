import "./CustomersSkeleton.css";

export default function CustomersSkeleton() {
  return (
    <div className="customers-skeleton">
      <div className="customers-skeleton-header">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {Array.from({ length: 7 }).map((_, index) => (
        <div
          className="customers-skeleton-row"
          key={index}
        >
          <div className="customers-skeleton-customer">
            <span className="skeleton-avatar" />

            <div className="skeleton-customer-info">
              <span className="skeleton-line skeleton-name-line" />
              <span className="skeleton-line skeleton-id-line" />
            </div>
          </div>

          <div className="skeleton-contact">
            <span className="skeleton-line skeleton-email-line" />
            <span className="skeleton-line skeleton-phone-line" />
          </div>

          <span className="skeleton-line skeleton-order-line" />

          <span className="skeleton-line skeleton-money-line" />

          <span className="skeleton-status" />

          <span className="skeleton-action" />
        </div>
      ))}
    </div>
  );
}