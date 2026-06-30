"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ProductCard } from "@/components/features/products/ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductItem {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
  product_translations: { title: string; short_description: string | null }[] | { title: string; short_description: string | null };
}

interface FeaturedProductsSectionProps {
  title: string;
  initialProducts: ProductItem[];
  categoryNameMap: Record<number, string>;
  activeLangId: number;
}

export function FeaturedProductsSection({
  title,
  initialProducts,
  categoryNameMap,
}: FeaturedProductsSectionProps) {
  const locale = useLocale();

  if (initialProducts.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto w-full select-none">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-text-main font-sans">{title}</h2>
        <Link
          href={`/${locale}/products`}
          className="flex items-center gap-1 text-sm text-primary hover:underline font-semibold"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {initialProducts.slice(0, 10).map((product) => {
          const translations = product.product_translations;
          const translation = Array.isArray(translations) ? translations[0] : translations;
          const title = translation?.title ?? "";
          const categoryName = product.category_id != null ? (categoryNameMap[product.category_id] ?? "") : "";
          return (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName}
              title={title}
            />
          );
        })}
      </div>
    </section>
  );
}
