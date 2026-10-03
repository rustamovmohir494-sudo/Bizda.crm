import "./MediaSkeleton.css";

export default function MediaSkeleton() {
  return (
    <div className="media-skeleton">
      <div className="media-skeleton-header">
        <div className="skeleton-back" />

        <div className="skeleton-title">
          <div />
          <span />
        </div>

        <div className="skeleton-count" />
      </div>

      <div className="skeleton-upload">
        <div className="skeleton-line large" />
        <div className="skeleton-inputs">
          <div />
          <div />
          <div />
        </div>
      </div>

      <div className="skeleton-section">
        <div className="skeleton-section-title" />

        <div className="skeleton-grid">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="skeleton-card"
            >
              <div className="skeleton-image" />
              <div className="skeleton-card-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}