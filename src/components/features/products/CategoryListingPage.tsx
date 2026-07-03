"use client";

import { useState, useMemo } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ProductCard } from "@/components/features/products/ProductCard";
import { ProductFilterSidebar } from "@/components/features/products/ProductFilterSidebar";
import { Pagination } from "@/components/features/products/Pagination";

interface CategoryProduct {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
  brand_id?: number | null;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  product_translations: { title: string; short_description: string | null }[] | { title: string; short_description: string | null };
  product_images?: { image_url: string; is_main: boolean | null; row_order: number | null }[];
  vendors?: { shop_name: string; shop_slug: string } | null;
  brands?: { name: string; slug: string } | null;
}

interface CategoryListingPageProps {
  slug: string;
  locale: string;
  categoryName: string;
  products: CategoryProduct[];
  categories: { label: string; slug: string; count: number }[];
  parentCategory?: { label: string; slug: string } | null;
  brands?: { id: number; name: string; count: number }[];
  colors?: { name: string; hex_code?: string | null; count: number }[];
  sizes?: { name: string; count: number }[];
  materials?: { name: string; count: number }[];
  maxPrice?: number;
}

export function CategoryListingPage({
  slug,
  locale,
  categoryName,
  products,
  categories,
  parentCategory,
  brands = [],
  colors = [],
  sizes = [],
  materials = [],
  maxPrice = 500,
}: CategoryListingPageProps) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [sort, setSort] = useState("most_recent");
  const [filters, setFilters] = useState({
    brands: [] as string[],
    materials: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: [0, maxPrice] as [number, number],
    keyword: "",
  });

  const filteredProducts = useMemo(() => {
    let result = products;

    if (filters.brands.length > 0) {
      result = result.filter((p) => {
        if (!p.brands) return false;
        const brandName = Array.isArray(p.brands) ? p.brands[0]?.name : (p.brands as any)?.name;
        return brandName && filters.brands.includes(brandName);
      });
    }

    if (filters.materials.length > 0) {
      result = result.filter((p) => p.material && filters.materials.includes(p.material));
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) => p.color && filters.colors.includes(p.color));
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.size && filters.sizes.includes(p.size));
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
      result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    }

    if (filters.keyword.trim()) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter((p) => {
        const translations = p.product_translations;
        const t = Array.isArray(translations) ? translations[0] : translations;
        return t?.title?.toLowerCase().includes(kw);
      });
    }

    switch (sort) {
      case "price_low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => ((b.created_at || "") > (a.created_at || "") ? 1 : -1));
        break;
    }

    return result;
  }, [products, filters, sort, maxPrice]);

  const perPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginated = filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb
        items={
          slug && slug !== "products"
            ? [
                { label: "Home", href: `/${locale}` },
                { label: "Products", href: `/${locale}/products` },
                { label: categoryName },
              ]
            : [
                { label: "Home", href: `/${locale}` },
                { label: "Products" },
              ]
        }
      />
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-[28px] font-bold text-text-main mb-8">{categoryName}</h1>
        <div className="flex gap-6">
          <ProductFilterSidebar
            filters={filters}
            onChange={(f) => { setFilters(f); setCurrentPage(1); }}
            categories={categories}
            currentCategory={slug}
            parentCategory={parentCategory}
            onCategoryChange={(s) => {
              if (s === "products" || !s) {
                window.location.href = `/${locale}/products`;
              } else {
                window.location.href = `/${locale}/products/${s}`;
              }
            }}
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
            brands={brands}
            colors={colors}
            sizes={sizes}
            materials={materials}
            maxPrice={maxPrice}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 hidden md:block">
                {t("listing.showing")} {filteredProducts.length === 0 ? 0 : `1-${Math.min(perPage, filteredProducts.length)}`} {t("listing.of")} {filteredProducts.length} {t("listing.results")}
              </p>
              <button
                type="button"
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-md text-sm lg:hidden cursor-pointer"
              >
                <Filter size={16} />
                {t("listing.filterProducts")}
              </button>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="most_recent">{t("listing.mostRecent")}</option>
                  <option value="price_low">{t("listing.lowestPrice")}</option>
                  <option value="price_high">{t("listing.highestPrice")}</option>
                  <option value="newest">{t("listing.newest")}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
              {paginated.map((product) => {
                const translations = product.product_translations;
                const translation = Array.isArray(translations) ? translations[0] : translations;
                const title = translation?.title ?? "";
                return (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    categoryName={categoryName}
                    title={title}
                  />
                );
              })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
