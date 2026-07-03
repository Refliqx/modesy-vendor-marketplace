"use client";

import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ProductCard } from "@/components/features/products/ProductCard";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistIds } from "@/hooks/queries/useWishlist";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchWishlistProductsByIds } from "@/lib/queries/fetch-wishlist-products";

interface WishlistPageClientProps {
  locale: string;
}

export function WishlistPageClient({ locale }: WishlistPageClientProps) {
  const t = useTranslations();
  const user = useCartStore((s) => s.user);
  const { data: wishlistIds, isLoading: idsLoading } = useWishlistIds(user?.id);
  const ids = wishlistIds ? Array.from(wishlistIds) : [];

  const { data: items = [], isLoading: productsLoading } = useQuery({
    queryKey: ["wishlist-products", locale],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const supabase = createClient();
      return fetchWishlistProductsByIds(supabase as any, ids, locale);
    },
    enabled: ids.length > 0,
    staleTime: 30_000,
  });

  const loading = idsLoading || (ids.length > 0 && productsLoading);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 select-none">
        <Breadcrumb items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("wishlistPage.title") }]} />
        <div className="flex-1 flex items-center justify-center py-24">
          <Loader2 className="text-primary animate-spin" size={36} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col flex-1 select-none">
        <Breadcrumb items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("wishlistPage.title") }]} />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-6">
          <Heart size={64} className="text-gray-300 animate-pulse" />
          <p className="text-lg font-medium text-gray-500 mt-4">{t("wishlistPage.empty")}</p>
          <Link
            href={`/${locale}`}
            className="bg-primary text-white px-8 h-11 rounded-md font-semibold mt-6 flex items-center hover:bg-primary-hover transition-colors text-sm shadow-sm"
          >
            {t("wishlistPage.exploreProducts")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("wishlistPage.title") }]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold text-text-main mb-6 font-sans">
          {t("wishlistPage.title")} <span className="text-gray-400 font-bold text-2xl">({items.length})</span>
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((product) => {
            const translations = product.product_translations;
            const translation = Array.isArray(translations) ? translations[0] : translations;
            const title = translation?.title ?? product.slug;

            return (
              <ProductCard
                key={product.id}
                product={product as any}
                categoryName="Wishlisted"
                title={title}
                initialWishlisted={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
