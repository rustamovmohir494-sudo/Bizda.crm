import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type { Brand } from "../../types/brand";

interface BrandActionsProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export default function BrandActions({
  brand,
  onEdit,
  onDelete,
}: BrandActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMouseMove = (
      event: MouseEvent,
    ) => {
      const wrapper =
        wrapperRef.current;

      if (!wrapper) {
        return;
      }

      const target =
        event.target as Node | null;

      // More tugmasi yoki Edit/Delete menu ichida bo'lsa,
      // menu ochiq qoladi.
      if (
        target &&
        wrapper.contains(target)
      ) {
        return;
      }

      // Butun More zonasidan chiqib ketganda yopiladi.
      setIsOpen(false);
    };

    document.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(brand);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(brand);
  };

  return (
    <div
      ref={wrapperRef}
      className="brand-actions-wrapper"
    >
      <button
        type="button"
        className="brand-action-button more"
        aria-label="More actions"
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="brand-more-menu">
          <button
            type="button"
            onClick={handleEdit}
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="delete"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}