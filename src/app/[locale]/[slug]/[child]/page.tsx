"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Filter } from "lucide-react";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ProductCard } from "@/components/features/products/ProductCard";
import { ProductFilterSidebar } from "@/components/features/products/ProductFilterSidebar";
import { Pagination } from "@/components/features/products/Pagination";
import { dummyProducts } from "@/lib/dummy/products";
import { notFound } from "next/navigation";

export default function SubCategoryPage() {
  const locale = useLocale();
  const params = useParams();
  const parent = params.slug as string;
  const child = params.child as string;

  const categoryName = child
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const filtered = dummyProducts.filter((p) =>
    p.categoryName.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === child ||
    p.categoryName.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') === parent
  );

  if (filtered.length === 0) notFound();

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    fabrics: [] as string[],
    priceRange: [0, 500] as [number, number],
    keyword: "",
  });

  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    dummyProducts.forEach((p) => {
      const key = p.categoryName.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([slug, count]) => ({
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      slug,
      count,
    }));
  }, []);

  const perPage = 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex flex-col flex-1">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: parent.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()), href: `/${locale}/${parent}` },
        { label: categoryName },
      ]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-[28px] font-bold text-text-main mb-8">{categoryName}</h1>
        <div className="flex gap-8">
          <ProductFilterSidebar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            currentCategory={child}
            onCategoryChange={(s) => window.location.href = `/${locale}/${s}`}
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 hidden md:block">
                Showing 1-{Math.min(perPage, filtered.length)} of {filtered.length} results
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
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    slug: product.slug,
                    price: product.price,
                    discount_percent: product.discountPercent,
                    category_id: null,
                  }}
                  categoryName={product.categoryName}
                  title={product.title}
                  rating_average={product.rating ?? undefined}
                />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
