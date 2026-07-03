  "use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/features/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductItem {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
  product_translations:
    | { title: string; short_description: string | null }[]
    | { title: string; short_description: string | null };
}

interface ProductCarouselSectionProps {
  title: string;
  viewAllHref?: string;
  products: ProductItem[];
  categoryNameMap: Record<number, string>;
}

export function ProductCarouselSection({
  title,
  viewAllHref = "#",
  products,
  categoryNameMap,
}: ProductCarouselSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!products || products.length === 0) return null;

  const cards = products.slice(0, 10).map((product) => {
    const translations = product.product_translations;
    const translation = Array.isArray(translations) ? translations[0] : translations;
    const productTitle = translation?.title ?? "";
    const categoryName =
      product.category_id != null ? (categoryNameMap[product.category_id] ?? "") : "";

    return (
      <ProductCard
        key={product.id}
        product={product}
        categoryName={categoryName}
        title={productTitle}
      />
    );
  });

  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto w-full select-none">
      {!mounted ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-text-main">{title}</h2>
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-primary hover:underline font-medium animate-pulse"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {cards}
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-text-main">{title}</h2>
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
          >
            <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-lg transition-all cursor-pointer flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none z-10 hover:bg-gray-50 hover:shadow-xl" />
            <CarouselNext className="right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-800 shadow-lg transition-all cursor-pointer flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none z-10 hover:bg-gray-50 hover:shadow-xl" />

            <CarouselContent className="-ml-4">
              {products.slice(0, 10).map((product) => {
                const translations = product.product_translations;
                const translation = Array.isArray(translations)
                  ? translations[0]
                  : translations;
                const productTitle = translation?.title ?? "";
                const categoryName =
                  product.category_id != null
                    ? (categoryNameMap[product.category_id] ?? "")
                    : "";

                return (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/5 shrink-0"
                  >
                    <ProductCard
                      product={product}
                      categoryName={categoryName}
                      title={productTitle}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  );
}
