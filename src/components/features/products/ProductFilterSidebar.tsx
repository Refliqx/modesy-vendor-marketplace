"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Filter, X, ChevronLeft, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface FilterState {
  brands: string[];
  materials: string[];
  colors: string[];
  sizes: string[];
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
  brands?: { id: number; name: string; count: number }[];
  colors?: { name: string; hex_code?: string | null; count: number }[];
  sizes?: { name: string; count: number }[];
  materials?: { name: string; count: number }[];
  maxPrice?: number;
}

export function ProductFilterSidebar({
  filters,
  onChange,
  categories,
  currentCategory,
  parentCategory,
  onCategoryChange,
  isOpen,
  onClose,
  brands = [],
  colors = [],
  sizes = [],
  materials = [],
  maxPrice = 500,
}: ProductFilterSidebarProps) {
  const t = useTranslations();
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands });
  };

  const toggleMaterial = (mat: string) => {
    const updated = filters.materials.includes(mat)
      ? filters.materials.filter((m) => m !== mat)
      : [...filters.materials, mat];
    onChange({ ...filters, materials: updated });
  };

  const toggleColor = (col: string) => {
    const updated = filters.colors.includes(col)
      ? filters.colors.filter((c) => c !== col)
      : [...filters.colors, col];
    onChange({ ...filters, colors: updated });
  };

  const toggleSize = (sz: string) => {
    const updated = filters.sizes.includes(sz)
      ? filters.sizes.filter((s) => s !== sz)
      : [...filters.sizes, sz];
    onChange({ ...filters, sizes: updated });
  };

  const applyKeyword = () => {
    onChange({ ...filters, keyword: localKeyword });
  };

  const content = (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-text-main">{t("filter.filters")}</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.category")}</h4>
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
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.brand")}</h4>
        {brands.length === 0 ? (
          <p className="text-xs text-gray-400">{t("filter.noBrands")}</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.name)}
                  onChange={() => toggleBrand(brand.name)}
                  className="accent-primary w-4 h-4 rounded border-gray-300"
                />
                <span className="flex-1">{brand.name}</span>
                {brand.count > 0 && <span className="text-xs text-gray-400">({brand.count})</span>}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.color")}</h4>
        <div className="flex flex-wrap gap-2">
          {colors.length === 0 ? (
            <p className="text-xs text-gray-400">{t("filter.noColors")}</p>
          ) : (
            colors.map((col) => {
              const selected = filters.colors.includes(col.name);
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => toggleColor(col.name)}
                  className={cn(
                    "group relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer outline-none",
                    selected ? "border-primary scale-110 shadow-sm" : "border-gray-200 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: col.hex_code || col.name.toLowerCase() }}
                  title={col.name}
                  aria-label={col.name}
                >
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={10} className={cn(col.name === "White" || col.name === "Beige" ? "text-gray-600" : "text-white")} />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.size")}</h4>
        {sizes.length === 0 ? (
          <p className="text-xs text-gray-400">{t("filter.noSizes")}</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((sz) => {
              const selected = filters.sizes.includes(sz.name);
              return (
                <button
                  key={sz.name}
                  type="button"
                  onClick={() => toggleSize(sz.name)}
                  className={cn(
                    "h-8 px-3 text-xs font-semibold rounded-md border transition-colors cursor-pointer outline-none",
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                  )}
                >
                  {sz.name}
                  {sz.count > 0 && <span className="ml-1 opacity-60">({sz.count})</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.material")}</h4>
        {materials.length === 0 ? (
          <p className="text-xs text-gray-400">{t("filter.noMaterials")}</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {materials.map((mat) => (
              <label key={mat.name} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(mat.name)}
                  onChange={() => toggleMaterial(mat.name)}
                  className="accent-primary w-4 h-4 rounded border-gray-300"
                />
                <span className="flex-1">{mat.name}</span>
                {mat.count > 0 && <span className="text-xs text-gray-400">({mat.count})</span>}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-gray-100 py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.price")}</h4>
        <p className="text-sm text-gray-500 mb-2">
          ${Number(filters.priceRange[0]).toFixed(0)} — ${Number(filters.priceRange[1]).toFixed(0)}
        </p>
        <input
          type="range"
          min={0}
          max={maxPrice}
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
          max={maxPrice}
          value={filters.priceRange[1]}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange({ ...filters, priceRange: [filters.priceRange[0], Math.max(val, filters.priceRange[0])] });
          }}
          className="w-full accent-primary"
        />
      </div>

      <div className="py-5">
        <h4 className="font-semibold text-sm text-text-main mb-3 uppercase tracking-wide">{t("filter.keyword")}</h4>
        <input
          type="text"
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.target.value)}
          placeholder={t("filter.searchPlaceholder")}
          className="w-full h-10 px-3 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mb-3"
          onKeyDown={(e) => e.key === "Enter" && applyKeyword()}
        />
        <button
          type="button"
          onClick={applyKeyword}
          className="w-full h-10 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
        >
          {t("filter.filter")}
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
