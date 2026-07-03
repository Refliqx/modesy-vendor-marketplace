"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Eye,
  TrendingUp,
  Truck,
  MapPin,
  Share2,
  MessageCircle,
  Globe,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useAddToCart } from "@/hooks/queries/useCartMutations";
import { useWishlistIds, useToggleWishlist } from "@/hooks/queries/useWishlist";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ProductVariationSelector, type OptionValue, type ProductOption } from "./ProductVariationSelector";

interface ProductInfoPanelProps {
  product: {
    id: number;
    slug: string;
    price: number;
    discount_percent: number | null;
    stock: number;
    type: "physical" | "digital";
    weight: number | null;
    vendor_id: number | null;
    product_translations: { title: string; description: string; short_description: string | null }[] | { title: string; description: string; short_description: string | null } | null;
    vendors: { shop_name: string; shop_slug: string } | null;
    product_options?: ProductOption[];
  };
  reviewsCount: number;
  ratingAverage: number;
}

export function ProductInfoPanel({ product, reviewsCount, ratingAverage }: ProductInfoPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, OptionValue>>({});
  
  const formatPrice = useFormatPrice();
  const locale = useLocale();
  const t = useTranslations();
  const user = useCartStore((s) => s.user);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { mutateAsync: addToCart } = useAddToCart();
  const { data: wishlistedIds } = useWishlistIds(user?.id);
  const { mutateAsync: toggleWishlistMutation } = useToggleWishlist();

  useEffect(() => {
    if (wishlistedIds) {
      setWishlisted(wishlistedIds.has(product.id));
    } else {
      const stored = localStorage.getItem("modesy_guest_wishlist");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setWishlisted(ids.includes(product.id));
          }
        } catch {
          // ignore
        }
      }
    }
  }, [user, product.id, wishlistedIds]);

  const handleWishlistClick = async () => {
    const prev = wishlisted;
    setWishlisted(!prev);

    try {
      const res = await toggleWishlistMutation(product.id);
      setWishlisted(res.wishlisted ?? !prev);
    } catch {
      setWishlisted(prev);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error("This option is currently out of stock");
      return;
    }

    await addToCart({ productId: product.id, locale, quantity });
  };

  // Compute live price based on selected variation modifiers
  const basePrice = product.price || 0;
  const modifiersSum = Object.values(selectedOptions).reduce(
    (sum, val) => sum + (val.price_modifier || 0),
    0
  );
  const currentBasePrice = basePrice + modifiersSum;
  const discountedPrice =
    product.discount_percent != null
      ? currentBasePrice - (currentBasePrice * product.discount_percent) / 100
      : null;

  // Compute live stock based on selected options
  const hasOptions = product.product_options && product.product_options.length > 0;
  const maxStock = hasOptions
    ? Object.keys(selectedOptions).length === product.product_options?.length
      ? Math.min(...Object.values(selectedOptions).map((val) => val.stock ?? 0))
      : 0
    : product.stock;

  const isOutOfStock = maxStock <= 0;
  const isQuote = product.price === 0 || product.price === null;
  const isDigital = product.type === "digital";

  // Vendor & translations resolve
  const shopName = product.vendors?.shop_name || "Admin";
  const shopSlug = product.vendors?.shop_slug || "admin";
  const translation = Array.isArray(product.product_translations)
    ? product.product_translations[0]
    : product.product_translations;
  const title = translation?.title || product.slug;

  return (
    <div className="select-none">
      <h1 className="text-2xl md:text-[26px] font-bold text-text-main mb-2 font-sans">{title}</h1>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-sans">
        <span>{t("product.seller")}:</span>
        <Link href={`/${locale}/profile/${shopSlug}`} className="text-primary font-medium hover:underline">
          {shopName}
        </Link>
        {reviewsCount > 0 && (
          <>
            <span className="text-gray-300">|</span>
            <Link href="#reviews" className="hover:underline flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={cn(
                      "stroke-none",
                      i < Math.round(ratingAverage) ? "fill-yellow-400" : "fill-gray-200"
                    )}
                  />
                ))}
              </div>
              ({reviewsCount} {t("product.reviews") || "reviews"})
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-sans">
        <span className="flex items-center gap-1"><Eye size={14} /> 0 {t("product.views")}</span>
        <span className="flex items-center gap-1"><Heart size={14} /> 0 {t("product.favorites")}</span>
        <span className="flex items-center gap-1"><TrendingUp size={14} /> 0 {t("product.sold")}</span>
      </div>

      {isQuote ? (
        <div className="my-4 font-sans text-lg font-semibold text-text-muted">
          <Link href={`/${locale}/contact`} className="text-primary underline hover:text-primary-hover">
            {t("product.requestQuote")}
          </Link>
        </div>
      ) : (
        <div className="flex items-baseline gap-2 my-4">
          <span className="text-3xl font-bold text-primary font-sans">
            {formatPrice(discountedPrice ?? currentBasePrice)}
          </span>
          {discountedPrice != null && (
            <>
              <span className="text-lg text-gray-400 line-through font-sans">
                {formatPrice(currentBasePrice)}
              </span>
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md font-sans">
                -{product.discount_percent}%
              </span>
            </>
          )}
        </div>
      )}

      {/* Product Metadata & Info */}
      <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-b border-gray-100 py-4 mb-6">
        <div>
          <span className="text-gray-500 font-sans">{t("product.status")}: </span>
          <span className={isOutOfStock ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
            {isOutOfStock ? t("product.outOfStock") : `${t("product.inStock")} (${maxStock})`}
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-sans">{t("product.sku")}: </span>
          <span className="text-gray-700 font-sans">MD-{product.id}</span>
        </div>
        {!isDigital && product.weight !== null && (
          <div>
            <span className="text-gray-500 font-sans">{t("product.weight")}: </span>
            <span className="text-gray-700 font-sans">{product.weight} g</span>
          </div>
        )}
      </div>

      {/* Variations Option Value Selector */}
      {product.product_options && product.product_options.length > 0 && (
        <ProductVariationSelector
          options={product.product_options}
          onChange={setSelectedOptions}
        />
      )}

      {!isQuote && (
        <>
          <div className="flex items-center border border-gray-200 rounded-md w-fit h-11 mb-4">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-full text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-lg outline-none"
            >
              −
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="w-12 h-full text-center text-sm border-x border-gray-200 text-text-main bg-transparent outline-none font-sans"
            />
            <button
              type="button"
              disabled={quantity >= maxStock}
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              className="w-11 h-full text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer text-lg outline-none"
            >
              +
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 text-white h-12 px-8 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer font-sans",
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover"
              )}
            >
              <ShoppingCart size={18} />
              {isOutOfStock ? t("product.outOfStock") : t("product.addToCart")}
            </button>
            <button
              type="button"
              onClick={handleWishlistClick}
              className={cn(
                "flex-1 sm:flex-none h-12 px-6 rounded-md font-medium flex items-center justify-center gap-2 border transition-colors cursor-pointer font-sans",
                wishlisted
                  ? "border-red-400 text-red-500 bg-red-50/20"
                  : "border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500"
              )}
            >
              <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : ""} />
              {wishlisted ? t("product.wishlisted") : t("product.addToWishlist")}
            </button>
          </div>
        </>
      )}

      {!isDigital && (
        <div className="bg-gray-50 rounded-md p-3">
          <p className="flex items-center gap-2 text-sm text-gray-600 font-sans">
            <Truck size={16} className="text-primary shrink-0" />
            {t("product.readyToShip")}
          </p>
          <p className="flex items-center gap-2 text-sm text-gray-600 mt-1 font-sans">
            <MapPin size={16} className="text-primary shrink-0" />
            <span>{t("product.estimatedDelivery")}: </span>
            <button type="button" className="text-primary hover:underline cursor-pointer outline-none font-sans">
              {t("product.selectLocation")}
            </button>
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-500 font-sans">{t("product.share")}:</span>
        <button type="button" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
          <MessageCircle size={14} className="text-gray-600" />
        </button>
        <button type="button" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
          <Globe size={14} className="text-gray-600" />
        </button>
        <button type="button" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
          <Share2 size={14} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
