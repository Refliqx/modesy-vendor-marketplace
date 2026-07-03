"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useTranslations } from "next-intl";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useAddToCart } from "@/hooks/queries/useCartMutations";
import { useToggleWishlist, useWishlistIds } from "@/hooks/queries/useWishlist";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale } from "next-intl";

interface ProductCardProduct {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  is_featured?: boolean | null;
  category_id: number | null;
  product_images?: {
    image_url: string;
    is_main: boolean | null;
    row_order: number | null;
  }[];
  vendors?: {
    shop_name: string;
    shop_slug: string;
  } | {
    shop_name: string;
    shop_slug: string;
  }[] | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  categoryName: string;
  title: string;
  rating_average?: number;
  rating_count?: number;
  initialWishlisted?: boolean;
  onWishlistToggle?: (wishlisted: boolean) => void;
}

const ProductCardComponent = memo(function ProductCard({
  product,
  categoryName,
  title,
  rating_average,
  rating_count,
  initialWishlisted,
  onWishlistToggle,
}: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [localWishlisted, setLocalWishlisted] = useState<boolean | null>(null);
  const formatPrice = useFormatPrice();
  const user = useCartStore((s) => s.user);
  const { data: wishlistedIds } = useWishlistIds(user?.id);
  const openAuthModal = useAuthModalStore((s) => s.open);

  const wishlisted = localWishlisted ?? (initialWishlisted ?? wishlistedIds?.has(product.id) ?? false);

  const discountedPrice =
    product.discount_percent != null
      ? product.price - (product.price * product.discount_percent) / 100
      : null;

  const vendorData = product.vendors;
  const vendor = Array.isArray(vendorData) ? vendorData[0] : vendorData;
  const shopName = vendor?.shop_name || "Admin";
  const shopSlug = vendor?.shop_slug || "admin";

  let imageUrl = `https://picsum.photos/seed/product-${product.id}/400/400`;
  if (product.product_images && product.product_images.length > 0) {
    const mainImage = product.product_images.find((img) => img.is_main === true);
    if (mainImage) {
      imageUrl = mainImage.image_url;
    } else {
      const sorted = [...product.product_images].sort(
        (a, b) => (a.row_order ?? 0) - (b.row_order ?? 0)
      );
      if (sorted[0]) {
        imageUrl = sorted[0].image_url;
      }
    }
  }

  const addToCartMutation = useAddToCart();
  const toggleWishlistMutation = useToggleWishlist();

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal(); return; }
    addToCartMutation.mutate({ productId: product.id, locale });
  }, [user, product.id, locale, addToCartMutation, openAuthModal]);

  const handleWishlistClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlisted;
    setLocalWishlisted(nextState);
    if (onWishlistToggle) onWishlistToggle(nextState);
    toggleWishlistMutation.mutate(product.id, {
      onSettled: () => setLocalWishlisted(null),
    });
  }, [wishlisted, onWishlistToggle, toggleWishlistMutation, product.id]);

  const hasRating = rating_count != null && rating_count > 0 && rating_average != null;

  return (
    <div className="group w-full block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
      <div className="relative aspect-[4/5]">
        <Link href={`/${locale}/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.is_featured && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase">
              {t("product.featured")}
            </span>
          )}
          {product.discount_percent != null && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm self-start">
              -{product.discount_percent}%
            </span>
          )}
        </div>
        <div className="absolute top-1.5 right-1.5 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200 shadow-sm",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
            aria-label={t("product.addToCart")}
          >
            <ShoppingCart size={14} className="text-gray-400 hover:text-primary transition-colors" />
          </button>
          <button
            type="button"
            onClick={handleWishlistClick}
            className={cn(
              "w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200 shadow-sm",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
            aria-label={wishlisted ? t("product.wishlisted") : t("product.addToWishlist")}
          >
            <Heart
              size={14}
              className={cn(
                "transition-colors",
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
              )}
            />
          </button>
        </div>
      </div>
      <div className="p-2.5 flex flex-col gap-1 h-[136px]">
        <h3 className="text-sm font-medium text-[#1F2937] line-clamp-2 leading-snug">
          <Link href={`/${locale}/${product.slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-[11px] text-gray-400 truncate">
          <Link href={`/${locale}/profile/${shopSlug}`} className="hover:text-primary transition-colors">
            {shopName}
          </Link>
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 select-none text-[11px] text-gray-400">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={cn(
                    "stroke-none",
                    i < (hasRating ? Math.round(rating_average) : 0) ? "fill-yellow-400" : "fill-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-gray-500">{hasRating ? `(${rating_count})` : "(0)"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          {discountedPrice != null ? (
            <>
              <span className="text-sm font-bold text-primary">{formatPrice(discountedPrice)}</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-[#1F2937]">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
});

export const ProductCard = ProductCardComponent;
