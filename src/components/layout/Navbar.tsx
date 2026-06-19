"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, ShoppingCart, Heart, ShoppingBag, Menu } from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 z-30 relative select-none">
      <div className="flex items-center">
        <button 
          type="button" 
          className="block md:hidden text-text-main hover:text-primary transition-colors cursor-pointer me-3 outline-none"
        >
          <Menu size={24} />
        </button>
        
        <Link href={`/${locale}`} className="flex items-center gap-0 text-[26px] font-bold tracking-tight">
          <span className="text-text-main">M</span>
          <span className="text-primary">o</span>
          <span className="text-text-main">desy</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative items-center">
        <input
          type="text"
          placeholder="Search for products, categories or brands"
          className="w-full h-11 pl-4 pr-10 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
        />
        <button 
          type="button" 
          className="absolute right-3 text-placeholder hover:text-text-main transition-colors cursor-pointer"
        >
          <Search size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link 
          href={`/${locale}/wishlist`} 
          className="flex items-center gap-1.5 text-text-main hover:text-primary transition-colors shrink-0"
        >
          <Heart size={22} />
          <span className="hidden sm:inline text-sm font-medium">{t("wishlist")}</span>
        </Link>

        <Link 
          href={`/${locale}/cart`} 
          className="flex items-center gap-1.5 text-text-main hover:text-primary transition-colors shrink-0"
        >
          <ShoppingCart size={22} />
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
