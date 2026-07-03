"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Language {
  id: number;
  name: string;
  code: string;
  text_direction: string | null;
}

export function LangDropdown({ languages, className }: { languages: Language[]; className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const currentLang = languages.find((l) => l.code === locale) || {
    code: locale,
    name: locale === "ar" ? "العربية" : "English",
    text_direction: locale === "ar" ? "rtl" : "ltr",
  };

  const getLanguageName = (code: string) => {
    const cleanCode = code.toLowerCase();
    if (locale === "ar") {
      const names: Record<string, string> = {
        en: "الإنجليزية",
        ar: "العربية",
      };
      return names[cleanCode] || "الإنجليزية";
    } else {
      const names: Record<string, string> = {
        en: "English",
        ar: "Arabic",
      };
      return names[cleanCode] || "English";
    }
  };

  const getFlagImage = (code: string) => {
    const cleanCode = code.toLowerCase();
    const flags: Record<string, string> = {
      en: "/images/US_EN_FLAG.jpg",
      ar: "/images/AR_FLAG.png",
    };
    const src = flags[cleanCode];
    if (!src) return null;
    return (
      <img
        src={src}
        alt={`${cleanCode === "ar" ? "Arabic" : "English"} flag`}
        width={20}
        height={14}
        className="object-cover inline-block shrink-0"
      />
    );
  };

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const query = typeof window !== "undefined" ? window.location.search : "";
    const newPath = (segments.join("/") || `/${newLocale}`) + query;

    window.location.href = newPath;
  };

  const displayLanguages =
    languages.length > 0
      ? languages
      : [
          { id: 1, name: "English", code: "en", text_direction: "ltr" },
          { id: 2, name: "Arabic", code: "ar", text_direction: "rtl" },
        ];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer outline-none",
          className || "text-white text-[13px]"
        )}
      >
        {getFlagImage(currentLang.code)}
        <span className="font-sans font-medium">{getLanguageName(currentLang.code)}</span>
        <ChevronDown size={12} className="opacity-60 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg min-w-[180px] z-50">
          <div className="py-1">
            {displayLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLocaleChange(lang.code)}
                className={cn(
                  "w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-sans text-[14px] text-start transition-colors",
                  locale === lang.code ? "text-primary font-medium bg-primary/5" : "text-gray-700"
                )}
              >
                <span className="flex items-center gap-2.5">
                  {getFlagImage(lang.code)}
                  <span>{getLanguageName(lang.code)}</span>
                </span>
                {locale === lang.code && (
                  <Check size={14} className="text-primary ms-2 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}