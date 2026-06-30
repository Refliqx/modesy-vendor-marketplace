"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useLocale } from "next-intl";
import type { NormalizedCartItem } from "@/types/cart";

interface CartItemRowProps {
  item: NormalizedCartItem;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const selected = useCurrencyStore((s) => s.selected);
  const _hasHydrated = useCurrencyStore((s) => s._hasHydrated);
  const locale = useLocale();

  const formatPrice = (amount: number) => {
    if (!_hasHydrated || !selected) return "";
    const converted = amount * (selected.exchange_rate ?? 1);
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selected.code,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const unitPrice = item.discountPercent != null 
    ? item.price - (item.price * item.discountPercent) / 100 
    : item.price;

  const imageUrl = `https://picsum.photos/seed/product-${item.productId}/200/200`;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-150 relative select-none">
      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-50 shrink-0 relative border border-gray-100">
        <Link href={`/${locale}/${item.slug}`}>
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </Link>
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/${locale}/${item.slug}`}
          className="text-sm font-medium text-text-main line-clamp-2 hover:text-primary transition-colors font-sans"
        >
          {item.title}
        </Link>
        
        {/* Vendor Badge */}
        <div className="mt-1">
          <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded-md inline-block font-sans">
            Seller: {item.vendorName}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-200 rounded-md h-8 select-none">
            <button
              type="button"
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="w-8 h-full text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed outline-none"
            >
              −
            </button>
            <span className="w-10 text-center text-sm border-x border-gray-200 text-text-main font-sans">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="w-8 h-full text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer outline-none"
            >
              +
            </button>
          </div>
          <span className="text-primary font-semibold text-sm ms-auto font-sans">
            {formatPrice(unitPrice * item.quantity)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="self-start text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 mt-1"
        aria-label="Remove item"
      >
        <X size={16} />
      </button>
    </div>
  );
}
