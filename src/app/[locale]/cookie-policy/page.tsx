"use client";

import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";

export default function CookiePage() {
  const t = useTranslations("cookiePage");
  const locale = useLocale();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: t("title") }]} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-md border border-gray-200 p-6 sm:p-8">
          <h1 className="text-[28px] font-bold text-text-main mb-2 border-b border-gray-200 pb-4">{t("title")}</h1>
          <p className="text-xs text-gray-400 mb-6">{t("updated")}</p>
          <div className="space-y-5 text-text-main leading-relaxed text-sm">
            <p>{t("p1")}</p>
            <h2 className="text-base font-bold text-text-main pt-2">{t("section1Title")}</h2>
            <p>{t("section1")}</p>
            <h2 className="text-base font-bold text-text-main pt-2">{t("section2Title")}</h2>
            <p>{t("section2")}</p>
            <p>{t("section2b")}</p>
            <p>{t("section2c")}</p>
            <p>{t("section2d")}</p>
            <h2 className="text-base font-bold text-text-main pt-2">{t("section3Title")}</h2>
            <p>{t("section3")}</p>
            <h2 className="text-base font-bold text-text-main pt-2">{t("section4Title")}</h2>
            <p>{t("section4")}</p>
            <h2 className="text-base font-bold text-text-main pt-2">{t("section5Title")}</h2>
            <p>{t("section5")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
