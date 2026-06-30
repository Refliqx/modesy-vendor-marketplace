"use client";

import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";

export default function SellOnModesyPage() {
  const t = useTranslations("sellOnModesyPage");
  const locale = useLocale();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb
        items={[
          { label: "Home", href: `/${locale}` },
          { label: t("title") },
        ]}
      />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-md border border-gray-200 p-6 sm:p-8">
          <h1 className="text-[28px] font-bold text-text-main mb-6 border-b border-gray-200 pb-4">
            {t("title")}
          </h1>
          <div className="space-y-6 text-text-main leading-relaxed text-sm">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
            <p>{t("p5")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
