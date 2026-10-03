import {
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

import "./MediaHeader.css";

interface MediaHeaderProps {
  productName: string;
  imageCount: number;
  onBack: () => void;
}

export default function MediaHeader({
  productName,
  imageCount,
  onBack,
}: MediaHeaderProps) {
  return (
    <div className="media-header">
      <button
        type="button"
        className="media-back-btn"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        <span>Products</span>
      </button>

      <div className="media-header-content">
        <div className="media-header-icon">
          <ImageIcon size={22} />
        </div>

        <div>
          <h1>Product Media</h1>

          <p>
            {productName}
          </p>
        </div>
      </div>

      <div className="media-count">
        {imageCount}{" "}
        {imageCount === 1
          ? "image"
          : "images"}
      </div>
    </div>
  );
}