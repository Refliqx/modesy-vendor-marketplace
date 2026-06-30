"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Home, ShoppingBag, Search, ArrowLeft } from "lucide-react";

const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
`;

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("notFound");
  const isRtl = locale === "ar";

  return (
    <div
      role="alert"
      className="flex-1 flex items-center justify-center min-h-[calc(100vh-40px-64px-48px)] px-6 py-16 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Floating orbs */}
        <div className="absolute -top-20 ltr:-left-20 rtl:-right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 ltr:-right-20 rtl:-left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/3 ltr:right-1/4 rtl:left-1/4 w-48 h-48 bg-[#1B2333]/5 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite_2s]" />

        {/* Grid dots pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0BAF9A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>

        {/* Diagonal lines */}
        <svg className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 opacity-[0.02]" viewBox="0 0 400 400">
          <line x1="0" y1="400" x2="400" y2="0" stroke="#0BAF9A" strokeWidth="1" />
          <line x1="50" y1="400" x2="400" y2="50" stroke="#0BAF9A" strokeWidth="0.5" />
          <line x1="0" y1="350" x2="350" y2="0" stroke="#0BAF9A" strokeWidth="0.5" />
          <line x1="100" y1="400" x2="400" y2="100" stroke="#0BAF9A" strokeWidth="0.3" />
          <line x1="0" y1="300" x2="300" y2="0" stroke="#0BAF9A" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Creative 404 art */}
        <div className="relative mb-10 select-none">
          <div className="text-[170px] sm:text-[200px] font-bold leading-none tracking-tighter flex items-center justify-center">
            <span className="text-[#1B2333] dark:text-gray-100">4</span>
            <span className="relative inline-flex items-center justify-center">
              <span className="text-primary">0</span>
              {/* Floating sparkle on the zero */}
              <span className="absolute -top-3 ltr:-right-2 rtl:-left-2 sm:-top-4 sm:ltr:-right-3 sm:rtl:-left-3">
                <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-ping opacity-50" />
              </span>
              <span className="absolute -top-2 ltr:-right-1 rtl:-left-1 sm:-top-3 sm:ltr:-right-2 sm:rtl:-left-2">
                <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full" />
              </span>
            </span>
            <span className="text-[#1B2333] dark:text-gray-100">4</span>
          </div>

          {/* Underline decoration */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-1 w-12 rounded-full bg-primary/30" />
            <span className="h-1.5 w-16 rounded-full bg-primary" />
            <span className="h-1 w-12 rounded-full bg-primary/30" />
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-4 tracking-tight">
          {t("title")}
        </h1>

        <p className="text-text-muted text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Action buttons */}
        <div className={`flex flex-wrap items-center justify-center gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2.5 h-12 px-7 bg-primary hover:bg-primary-hover text-white font-semibold text-[15px] rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span>{t("backHome")}</span>
          </Link>

          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2.5 h-12 px-7 border-2 border-border hover:border-primary text-text-main hover:text-primary font-medium text-[15px] rounded-md transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            <span>{t("browseProducts")}</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            type="button"
            className="group inline-flex items-center gap-2.5 h-12 px-7 text-text-muted hover:text-primary font-medium text-[15px] rounded-md transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft
              size={18}
              className={`group-hover:-translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`}
            />
            <span>{t("goBack")}</span>
          </button>
        </div>

        {/* Search hint */}
        <div className="mt-16 pt-8 border-t border-border/60 max-w-sm mx-auto">
          <p className="text-sm text-text-muted mb-4">{t("searchHint")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors group"
          >
            <Search size={14} className="group-hover:scale-110 transition-transform" />
            <span className="group-hover:underline">{t("searchLink")}</span>
          </Link>
        </div>
      </div>

      {/* Keyframes for floating background animation */}
      <style>{floatKeyframes}</style>
    </div>
  );
}
