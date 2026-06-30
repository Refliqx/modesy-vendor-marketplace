"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatNode {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  children?: CatNode[];
}

interface Props {
  currentSlug: string;
  currentCat: CatNode;
  rootCat: CatNode;
  locale: string;
  currentMin?: string;
  currentMax?: string;
  currentKeyword?: string;
  currentSort?: string;
}

export function CategorySidebar({
  currentSlug,
  currentCat,
  rootCat,
  locale,
  currentMin = "",
  currentMax = "",
  currentKeyword = "",
  currentSort = "recent",
}: Props) {
  const router = useRouter();
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);
  const [keyword, setKeyword] = useState(currentKeyword);

  const applyFilter = () => {
    const params = new URLSearchParams();
    params.set("sort", currentSort);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (keyword) params.set("keyword", keyword);
    router.push(`/${locale}/category/${currentSlug}?${params.toString()}`);
  };

  const isActive = (slug: string) => slug === currentSlug;

  return (
    <aside className="w-[200px] shrink-0 flex flex-col gap-5">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-text-main">Category</p>
        </div>
        <div className="py-2">
          {rootCat.parent_id !== null && (
            <Link
              href={`/${locale}/category/${rootCat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-text-main hover:text-primary transition-colors"
            >
              <ChevronLeft size={14} />
              {rootCat.name}
            </Link>
          )}
          {!rootCat.parent_id && (
            <div className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-text-main">
              <ChevronLeft size={14} />
              {rootCat.name}
            </div>
          )}

          {(rootCat.children ?? []).map((child) => (
            <Link
              key={child.id}
              href={`/${locale}/category/${child.slug}`}
              className={cn(
                "block px-6 py-1.5 text-sm transition-colors",
                isActive(child.slug)
                  ? "text-text-main font-medium"
                  : "text-text-muted hover:text-primary"
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-text-main">Price</p>
        </div>
        <div className="px-4 py-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full h-8 px-2 border border-gray-200 rounded text-sm text-text-main focus:outline-none focus:border-primary"
          />
          <span className="text-gray-400 shrink-0">-</span>
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full h-8 px-2 border border-gray-200 rounded text-sm text-text-main focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-text-main">Filter by keyword</p>
        </div>
        <div className="px-4 py-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
            className="w-full h-9 px-3 border border-gray-200 rounded text-sm text-text-main focus:outline-none focus:border-primary placeholder:text-placeholder"
          />
          <button
            type="button"
            onClick={applyFilter}
            className="w-full h-9 border border-gray-200 rounded text-sm text-text-main hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Search size={14} />
            Filter
          </button>
        </div>
      </div>
    </aside>
  );
}
