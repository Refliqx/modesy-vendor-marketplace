"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronLeft } from "lucide-react";

interface FilterState {
  brands: string[];
  fabrics: string[];
  priceRange: [number, number];
  keyword: string;
}

interface ProductFilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: { label: string; slug: string; count: number }[];
  currentCategory?: string;
  parentCategory?: { label: string; slug: string } | null;
  onCategoryChange?: (slug: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const brandOptions = ["Adidas", "Armani", "DenimCo", "SoleStyle", "LuxeAccents", "TailoredCo", "ArtisanHome", "TechSound", "PixelCraft", "KidzFun"];
const fabricOptions = ["Cotton", "Linen", "Denim", "Leather", "Polyester", "Wool", "Silk", "Canvas"];

export function ProductFilterSidebar({
  filters,
  onChange,
  categories,
  currentCategory,
  parentCategory,
  onCategoryChange,
  isOpen,
  onClose,
}: ProductFilterSidebarProps) {
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands });
  };

  const toggleFabric = (fabric: string) => {
    const fabrics = filters.fabrics.includes(fabric)
      ? filters.fabrics.filter((f) => f !== fabric)
      : [...filters.fabrics, fabric];
    onChange({ ...filters, fabrics });
  };

  const applyKeyword = () => {
    onChange({ ...filters, keyword: localKeyword });
  };

  const content = (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-text-main">Filters</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">Category</h4>
        <ul className="space-y-2">
          {parentCategory && (
            <li className="mb-2 pb-2 border-b border-gray-50/70">
              <button
                type="button"
                onClick={() => onCategoryChange?.(parentCategory.slug)}
                className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer outline-none flex items-center gap-1 font-semibold"
              >
                <ChevronLeft size={13} className="shrink-0" />
                {parentCategory.label}
              </button>
            </li>
          )}
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => onCategoryChange?.(cat.slug)}
                className={cn(
                  "text-sm transition-colors cursor-pointer outline-none",
                  currentCategory === cat.slug
                    ? "text-primary font-semibold"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                {cat.label} ({cat.count})
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-primary w-4 h-4 rounded border-gray-300"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">Fabric</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {fabricOptions.map((fabric) => (
            <label key={fabric} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fabrics.includes(fabric)}
                onChange={() => toggleFabric(fabric)}
                className="accent-primary w-4 h-4 rounded border-gray-300"
              />
              {fabric}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">Price</h4>
        <p className="text-sm text-gray-500 mb-2">${filters.priceRange[0]} — ${filters.priceRange[1]}</p>
        <input
          type="range"
          min={0}
          max={500}
          value={filters.priceRange[0]}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange({ ...filters, priceRange: [Math.min(val, filters.priceRange[1]), filters.priceRange[1]] });
          }}
          className="w-full accent-primary"
        />
        <input
          type="range"
          min={0}
          max={500}
          value={filters.priceRange[1]}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange({ ...filters, priceRange: [filters.priceRange[0], Math.max(val, filters.priceRange[0])] });
          }}
          className="w-full accent-primary"
        />
      </div>

      <div className="py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">Keyword</h4>
        <input
          type="text"
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.target.value)}
          placeholder="Search..."
          className="w-full h-10 px-3 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mb-3"
          onKeyDown={(e) => e.key === "Enter" && applyKeyword()}
        />
        <button
          type="button"
          onClick={applyKeyword}
          className="w-full h-10 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Filter
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-[220px] shrink-0">{content}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-white p-4 overflow-y-auto shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
