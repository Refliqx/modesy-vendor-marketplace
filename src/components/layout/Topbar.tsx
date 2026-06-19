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

  const { selectedCountry, _hasHydrated } = useLocationStore();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const displayLocation = _hasHydrated && selectedCountry 
    ? selectedCountry.name 
    : t("location");

  return (
    <div className="w-full h-10 bg-topbar-bg text-topbar-text text-[13px] font-normal flex items-center justify-between px-6 select-none z-40 relative">
      <div className="hidden md:flex gap-6 items-center">
        <Link 
          href={`/${locale}/contact`} 
          className="hover:underline hover:opacity-80 transition-opacity"
        >
          {t("contact")}
        </Link>
        <Link 
          href={`/${locale}/sell-on-modesy`} 
          className="hover:underline hover:opacity-80 transition-opacity"
        >
          {t("sellOnModesy")}
        </Link>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center ms-auto md:ms-0">
        <button 
          type="button"
          onClick={() => setIsLocationOpen(true)}
          className="flex items-center gap-1.5 hover:underline hover:opacity-80 transition-opacity cursor-pointer outline-none"
        >
          <MapPin size={14} className="text-primary" />
          <span className="truncate max-w-[150px]">{displayLocation}</span>
        </button>

        <CurrencyDropdown />

        <LangDropdown languages={languages} />

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={openAuthModal}
            className="hover:underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            {navT("login")}
          </button>
          <span className="opacity-40 select-none">/</span>
          <button 
            type="button"
            onClick={() => router.push(`/${locale}/register`)}
            className="hover:underline hover:opacity-80 transition-opacity cursor-pointer text-start"
          >
            {navT("register")}
          </button>
        </div>
      </div>

      <LocationModal 
        isOpen={isLocationOpen} 
        onClose={() => setIsLocationOpen(false)} 
      />
    </div>
  );
}
