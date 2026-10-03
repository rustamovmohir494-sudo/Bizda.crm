import "./DashboardSkeleton.css";

function SkeletonBox({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`dashboard-skeleton ${className}`}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="dashboard-page">
      {/* =========================
          STATS
      ========================= */}

      <div className="stats-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="dashboard-skeleton-card"
            key={index}
          >
            <div className="dashboard-skeleton-card-top">
              <div>
                <SkeletonBox className="skeleton-small" />

                <SkeletonBox className="skeleton-period" />
              </div>

              <SkeletonBox className="skeleton-menu" />
            </div>

            <SkeletonBox className="skeleton-value" />

            <div className="dashboard-skeleton-bottom">
              <SkeletonBox className="skeleton-percent" />

              <SkeletonBox className="skeleton-description" />
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          MAIN
      ========================= */}

      <div className="dashboard-grid">
        {/* WEEKLY */}
        <section className="dashboard-panel dashboard-skeleton-panel">
          <div className="dashboard-skeleton-panel-header">
            <div>
              <SkeletonBox className="skeleton-title" />

              <SkeletonBox className="skeleton-subtitle" />
            </div>

            <SkeletonBox className="skeleton-button" />
          </div>

          <div className="dashboard-skeleton-metrics">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  className="dashboard-skeleton-metric"
                  key={index}
                >
                  <SkeletonBox className="skeleton-metric-icon" />

                  <div>
                    <SkeletonBox className="skeleton-metric-value" />

                    <SkeletonBox className="skeleton-metric-label" />
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="dashboard-chart-skeleton">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <SkeletonBox
                  key={index}
                  className="skeleton-chart-line"
                />
              ),
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-panel dashboard-skeleton-panel">
          <div className="dashboard-skeleton-panel-header">
            <div>
              <SkeletonBox className="skeleton-title" />

              <SkeletonBox className="skeleton-subtitle" />
            </div>

            <SkeletonBox className="skeleton-menu" />
          </div>

          <div className="skeleton-activity-empty">
            <SkeletonBox className="skeleton-activity-icon" />

            <SkeletonBox className="skeleton-activity-title" />

            <SkeletonBox className="skeleton-activity-text" />
          </div>
        </section>
      </div>
    </div>
  );
}