"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = Math.min(maxVisible, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisible + 1);
        end = totalPages - 1;
      }

      if (start > 2) pages.push("ellipsis");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "w-9 h-9 rounded-md border text-sm flex items-center justify-center transition-colors",
          currentPage === 1
            ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
            : "hover:bg-gray-50 border-gray-200 text-gray-600 cursor-pointer"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-1 text-gray-400 select-none">...</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-md border text-sm flex items-center justify-center transition-colors",
              page === currentPage
                ? "bg-primary text-white border-primary"
                : "hover:bg-gray-50 border-gray-200 text-gray-600 cursor-pointer"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "w-9 h-9 rounded-md border text-sm flex items-center justify-center transition-colors",
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
            : "hover:bg-gray-50 border-gray-200 text-gray-600 cursor-pointer"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
