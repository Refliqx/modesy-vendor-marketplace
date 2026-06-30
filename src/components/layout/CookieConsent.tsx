"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsentAccepted");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsentAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <p className="text-sm text-gray-200 text-center sm:text-start leading-relaxed max-w-3xl">
        {t("message")}{" "}
        <Link
          href={`/${locale}/cookie-policy`}
          className="text-primary hover:underline font-medium"
        >
          {t("cookiePolicy")}
        </Link>
      </p>
      <button
        type="button"
        onClick={handleAccept}
        className="shrink-0 h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 rounded-md transition-colors cursor-pointer outline-none whitespace-nowrap"
      >
        {t("accept")}
      </button>
    </div>
  );
}
