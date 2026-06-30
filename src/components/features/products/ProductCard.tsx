"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useAddToCart } from "@/hooks/queries/useCartMutations";
import { useToggleWishlist, useWishlistIds } from "@/hooks/queries/useWishlist";
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

export function ProductCard({
  product,
  categoryName,
  title,
  rating_average,
  rating_count,
  initialWishlisted,
  onWishlistToggle,
}: ProductCardProps) {
  const locale = useLocale();
  const [localWishlisted, setLocalWishlisted] = useState<boolean | null>(null);
  const selected = useCurrencyStore((s) => s.selected);
  const _hasHydrated = useCurrencyStore((s) => s._hasHydrated);
  const user = useCartStore((s) => s.user);
  const { data: wishlistedIds } = useWishlistIds(user?.id);
  const openAuthModal = useAuthModalStore((s) => s.open);

  const wishlisted = localWishlisted ?? (initialWishlisted ?? wishlistedIds?.has(product.id) ?? false);

  const formatPrice = (amount: number) => {
    if (!_hasHydrated || !selected) return "";
    const converted = amount * (selected.exchange_rate ?? 1);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selected.code,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const discountedPrice =
    product.discount_percent != null
      ? product.price - (product.price * product.discount_percent) / 100
      : null;

  // Resolve Vendor Info
  const vendorData = product.vendors;
  const vendor = Array.isArray(vendorData) ? vendorData[0] : vendorData;
  const shopName = vendor?.shop_name || "Admin";
  const shopSlug = vendor?.shop_slug || "admin";

  // Resolve Main Image
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal();
      return;
    }

    addToCartMutation.mutate({ productId: product.id, locale });
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !wishlisted;
    setLocalWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(nextState);
    }

    toggleWishlistMutation.mutate(product.id, {
      onSettled: () => setLocalWishlisted(null),
    });
  };

  return (
    <div className="group w-full block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
      <div className="relative aspect-square">
        <Link href={`/${locale}/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_featured && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase">
              Featured
            </span>
          )}
          {product.discount_percent != null && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm self-start">
              -{product.discount_percent}%
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={handleWishlistClick}
            className={cn(
              "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
              )}
            />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} className="text-gray-400 hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
      <div className="p-3">
        {/* Vendor label */}
        <p className="text-[11px] text-gray-400 hover:text-primary transition-colors truncate mb-1">
          <Link href={`/${locale}/profile/${shopSlug}`} className="font-medium relative z-10">
            {shopName}
          </Link>
        </p>
        <h3 className="text-sm font-medium text-[#1F2937] line-clamp-2 min-h-[2.5rem] mb-1">
          <Link href={`/${locale}/${product.slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <div className="flex items-center gap-3 mb-1.5 select-none text-[11px] text-gray-400 font-sans">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const avg = rating_average ?? 5;
              return (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    "stroke-none",
                    i < Math.round(avg) ? "fill-yellow-400" : "fill-gray-200"
                  )}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <Heart size={12} className="text-gray-300 fill-gray-300" />
            <span className="text-gray-500 font-bold">{((product.id * 3 + 2) % 8) + 1}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {discountedPrice != null ? (
            <>
              <span className="text-base font-bold text-primary">{formatPrice(discountedPrice)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-base font-bold text-[#1F2937]">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
