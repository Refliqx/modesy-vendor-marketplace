"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
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
  product_translations: { title: string; short_description: string | null }[] | { title: string; short_description: string | null };
  product_images?: { image_url: string; is_main: boolean | null; row_order: number | null }[];
  vendors?: { shop_name: string; shop_slug: string } | null;
}

interface CategoryListingPageProps {
  slug: string;
  locale: string;
  categoryName: string;
  products: CategoryProduct[];
  categories: { label: string; slug: string; count: number }[];
  parentCategory?: { label: string; slug: string } | null;
}

export function CategoryListingPage({
  slug,
  locale,
  categoryName,
  products,
  categories,
  parentCategory,
}: CategoryListingPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    fabrics: [] as string[],
    priceRange: [0, 500] as [number, number],
    keyword: "",
  });

  const perPage = 12;
  const totalPages = Math.ceil(products.length / perPage);
  const paginated = products.slice((currentPage - 1) * perPage, currentPage * perPage);

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
            onChange={setFilters}
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
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 hidden md:block">
                Showing 1-{Math.min(perPage, products.length)} of {products.length} results
              </p>
              <button
                type="button"
                onClick={() => setShowMobileFilter(true)}
                className="flex items-center gap-2 h-10 px-3 border border-gray-200 rounded-md text-sm lg:hidden cursor-pointer"
              >
                <Filter size={16} />
                Filter Products
              </button>
              <select className="h-10 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:border-primary">
                <option>Most Recent</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
                <option>Highest Rating</option>
              </select>
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
