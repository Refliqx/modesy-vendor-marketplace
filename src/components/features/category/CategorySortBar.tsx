"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function CategorySortBar({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  const activeLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Most Recent";

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-md text-sm text-text-main hover:border-gray-300 transition-colors bg-white"
      >
        <ArrowUpDown size={14} className="text-gray-400" />
        <span>{activeLabel}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "w-full text-start px-4 py-2.5 text-sm transition-colors",
                currentSort === opt.value
                  ? "text-primary font-medium bg-primary/5"
                  : "text-text-main hover:bg-gray-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
