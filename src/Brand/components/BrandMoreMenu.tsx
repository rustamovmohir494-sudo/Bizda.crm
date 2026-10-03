import {
  Eye,
  Copy,
} from "lucide-react";

interface BrandMoreMenuProps {
  brandName: string;
  onClose: () => void;
}

export default function BrandMoreMenu({
  brandName,
  onClose,
}: BrandMoreMenuProps) {
  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(
        brandName,
      );

      onClose();
    } catch (error) {
      console.error(
        "Copy failed:",
        error,
      );
    }
  };

  return (
    <div className="brand-more-menu">
      <button
        type="button"
        onClick={onClose}
      >
        <Eye size={16} />
        View details
      </button>

      <button
        type="button"
        onClick={handleCopyName}
      >
        <Copy size={16} />
        Copy name
      </button>
    </div>
  );
}