"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, Heart, ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useCartItems } from "@/hooks/queries/useCartItems";
import { useWishlistIds } from "@/hooks/queries/useWishlist";
import { SearchBar } from "./SearchBar";
import { MobileNavDrawer } from "./MobileNavDrawer";

export function Navbar({ langId = 1 }: { langId?: number }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const user = useCartStore((s) => s.user);
  const { data: wishlistIds } = useWishlistIds(user?.id);
  const wishlistCount = wishlistIds?.size ?? 0;
  const { data: cartItems = [] } = useCartItems(locale, user?.id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 z-30 relative select-none">
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="block md:hidden text-text-main hover:text-primary transition-colors cursor-pointer me-3 outline-none"
        >
          <Menu size={24} />
        </button>

        <Link
          href={`/${locale}`}
          className="flex items-center gap-0 text-[26px] font-bold tracking-tight"
        >
          <span className="text-text-main">M</span>
          <span className="text-primary">o</span>
          <span className="text-text-main">desy</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1">
        <SearchBar langId={langId} />
      </div>

      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <Link
          href={`/${locale}/wishlist`}
          className="flex items-center gap-1.5 text-text-main hover:text-primary transition-colors shrink-0"
        >
          <div className="relative flex items-center justify-center w-7 h-7">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center select-none">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{t("wishlist")}</span>
        </Link>

        <Link
          href={`/${locale}/cart`}
          className="flex items-center gap-1.5 text-text-main hover:text-primary transition-colors shrink-0"
        >
          <div className="relative flex items-center justify-center w-7 h-7">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center select-none">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{t("cart")}</span>
        </Link>

        <Link
          href={`/${locale}/sell-now`}
          className="h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <ShoppingBag size={18} />
          <span className="hidden sm:inline">{t("sellNow")}</span>
        </Link>
      </div>
    </nav>
  );
}
