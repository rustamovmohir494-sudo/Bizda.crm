import {
  ImagePlus,
  Loader2,
  Plus,
} from "lucide-react";
import { useState } from "react";

import "./MediaUpload.css";

interface MediaUploadProps {
  isUploading: boolean;
  onUpload: (
    url: string,
    alt: string,
  ) => Promise<void>;
}

export default function MediaUpload({
  isUploading,
  onUpload,
}: MediaUploadProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const handleSubmit = async () => {
    if (!url.trim()) return;

    await onUpload(
      url,
      alt,
    );

    setUrl("");
    setAlt("");
  };

  return (
    <section className="media-upload">
      <div className="media-upload-title">
        <div className="media-upload-icon">
          <ImagePlus size={20} />
        </div>

        <div>
          <h2>Add Product Image</h2>

          <p>
            Product uchun yangi rasm
            qo'shing
          </p>
        </div>
      </div>

      <div className="media-upload-form">
        <div className="media-input-group">
          <label>Image URL</label>

          <input
            type="text"
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="media-input-group">
          <label>Alt text</label>

          <input
            type="text"
            value={alt}
            onChange={(event) =>
              setAlt(event.target.value)
            }
            placeholder="Product image"
          />
        </div>

        <button
          type="button"
          className="media-add-btn"
          onClick={handleSubmit}
          disabled={
            isUploading ||
            !url.trim()
          }
        >
          {isUploading ? (
            <Loader2
              size={17}
              className="media-spinner"
            />
          ) : (
            <Plus size={18} />
          )}

          {isUploading
            ? "Adding..."
            : "Add Image"}
        </button>
      </div>
    </section>
  );
}