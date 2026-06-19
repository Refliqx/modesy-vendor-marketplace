"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { cn } from "@/lib/utils";

interface ProductCardProduct {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  categoryName: string;
  title: string;
  rating_average?: number;
}

export function ProductCard({ product, categoryName, title, rating_average }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { selected, _hasHydrated } = useCurrencyStore();

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

  return (
    <Link href={`/product/${product.slug}`} className="group block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square bg-gray-50 relative">
        <Image
          src={`https://picsum.photos/seed/product-${product.id}/400/400`}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {product.discount_percent != null && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            -{product.discount_percent}%
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((prev) => !prev);
          }}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200",
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
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{categoryName}</p>
        <p className="text-sm font-medium text-[#1F2937] line-clamp-2 min-h-[2.5rem] mb-1.5">{title}</p>
        {rating_average != null && (
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-gray-500">{"★".repeat(Math.round(rating_average))}{"☆".repeat(5 - Math.round(rating_average))}</span>
          </div>
        )}
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
    </Link>
  );
}
