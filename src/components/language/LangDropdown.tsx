"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Check, ChevronDown } from "lucide-react";

interface Language {
  id: number;
  name: string;
  code: string;
  text_direction: string | null;
}

export function LangDropdown({ languages }: { languages: Language[] }) {
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

  const getFlagEmoji = (code: string) => {
    const flags: Record<string, string> = {
      ar: "🇸🇦",
      en: "🇺🇸",
    };
    return flags[code] ?? "🌐";
  };

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    // Replace the locale segment in the path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;

    // Hard navigate to ensure locale + html dir attribute changes properly
    window.location.href = newPath;
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 hover:underline hover:opacity-80 transition-opacity cursor-pointer outline-none text-white text-[13px]"
      >
        <span>
          {getFlagEmoji(currentLang.code)} {currentLang.name}
        </span>
        <ChevronDown size={12} className="opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg min-w-[180px] z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLocaleChange(lang.code)}
                className={`w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer font-sans text-[14px] text-start transition-colors ${
                  locale === lang.code
                    ? "text-primary font-medium bg-primary/5"
                    : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{getFlagEmoji(lang.code)}</span>
                  <span>{lang.name}</span>
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