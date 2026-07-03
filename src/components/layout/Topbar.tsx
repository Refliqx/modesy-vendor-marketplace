"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { CurrencyDropdown } from "@/components/currency/CurrencyDropdown";
import { LangDropdown } from "@/components/language/LangDropdown";
import { useLocationStore } from "@/stores/useLocationStore";
import { LocationModal } from "@/components/features/location/LocationModal";
import { useCartStore } from "@/stores/useCartStore";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Tag, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface Language {
  id: number;
  name: string;
  code: string;
  text_direction: string | null;
}

export function Topbar({ languages }: { languages: Language[] }) {
  const t = useTranslations("topbar");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const openAuthModal = useAuthModalStore((state) => state.open);

  const { selectedCountry, selectedState, selectedCity, _hasHydrated } = useLocationStore();
  const user = useCartStore((s) => s.user);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const displayLocation = _hasHydrated && selectedCountry 
    ? (() => {
        const parts = [selectedCity, selectedState?.name].filter(Boolean);
        return parts.length > 0
          ? `${parts.join(", ")}, ${selectedCountry.name}`
          : selectedCountry.name;
      })()
    : t("location");

  return (
    <div className="w-full h-10 bg-topbar-bg text-topbar-text text-[13px] font-normal hidden md:flex items-center justify-between px-4 sm:px-6 select-none z-40 relative">
      <div className="hidden md:flex gap-6 items-center shrink-0">
        <Link 
          href={`/${locale}/contact`} 
          className="hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {t("contact")}
        </Link>
        <Link 
          href={`/${locale}/sell-on-modesy`} 
          className="hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {t("sellOnModesy")}
        </Link>
      </div>

      <div className="flex gap-1.5 sm:gap-4 items-center ms-auto md:ms-0 shrink-0">
        <button 
          type="button"
          onClick={() => setIsLocationOpen(true)}
          className="flex items-center gap-1 hover:sm:gap-1.5 hover:opacity-80 transition-opacity cursor-pointer outline-none shrink-0"
        >
          <MapPin size={14} className="text-primary shrink-0" />
          <span className="hidden sm:inline truncate max-w-[100px] sm:max-w-[150px]">{displayLocation}</span>
        </button>

        <CurrencyDropdown />

        <LangDropdown languages={languages} />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 hover:opacity-85 transition-opacity cursor-pointer outline-none select-none py-1">
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="" 
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/20" 
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-topbar-text shrink-0 select-none border border-white/10">
                  <User size={13} className="fill-white/40 text-white/40" />
                </div>
              )}
              <span className="hidden sm:inline font-semibold text-topbar-text items-center gap-1 font-sans">
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
              </span>
              <ChevronDown size={13} className="opacity-70 shrink-0" />
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-52 bg-white border border-gray-150 rounded-md shadow-lg p-1.5 z-50">
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/profile/${slugify(user.user_metadata?.full_name || user.email?.split("@")[0] || "user")}`}>
                  <User size={16} className="text-gray-500 shrink-0" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/wallet`}>
                  <Wallet size={16} className="text-gray-500 shrink-0" />
                  <span>Wallet</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/orders`}>
                  <ShoppingBag size={16} className="text-gray-500 shrink-0" />
                  <span>Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/coupons`}>
                  <Tag size={16} className="text-gray-500 shrink-0" />
                  <span>My Coupons</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/messages`}>
                  <MessageSquare size={16} className="text-gray-500 shrink-0" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/dashboard`}>
                  <LayoutDashboard size={16} className="text-gray-500 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-50 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5">
                <Link href={`/${locale}/settings`}>
                  <Settings size={16} className="text-gray-500 shrink-0" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 rounded cursor-pointer outline-none px-3 py-2 text-sm text-text-main flex items-center gap-2.5"
              >
                <LogOut size={16} className="shrink-0" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={openAuthModal}
              className="hover:opacity-80 transition-opacity cursor-pointer font-sans"
            >
              {navT("login")}
            </button>
            <span className="opacity-40 select-none">/</span>
            <button 
              type="button"
              onClick={() => router.push(`/${locale}/register`)}
              className="hover:opacity-80 transition-opacity cursor-pointer text-start font-sans"
            >
              {navT("register")}
            </button>
          </div>
        )}
      </div>

      <LocationModal 
        isOpen={isLocationOpen} 
        onClose={() => setIsLocationOpen(false)} 
      />
    </div>
  );
}
