"use client";

import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Gift, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function AffiliateProgramPage() {
  const t = useTranslations("affiliatePage");
  const locale = useLocale();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: t("title") }]} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-md border border-gray-200 p-6 sm:p-8">
          <h1 className="text-[28px] font-bold text-text-main mb-6 border-b border-gray-200 pb-4">{t("title")}</h1>
          <p className="text-text-main leading-relaxed text-sm mb-8">{t("p1")}</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Gift, titleKey: "section1Title" as const, descKey: "section1" as const },
              { icon: TrendingUp, titleKey: "section2Title" as const, descKey: "section2" as const },
              { icon: Users, titleKey: "section3Title" as const, descKey: "section3" as const },
              { icon: CheckCircle, titleKey: "section4Title" as const, descKey: "section4" as const },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="border border-gray-100 rounded-lg p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-text-main mb-2">{t(item.titleKey)}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{t(item.descKey)}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              type="button"
              className="bg-primary hover:bg-primary-hover text-white font-semibold text-sm h-12 px-8 rounded-md transition-colors cursor-pointer outline-none"
            >
              {t("cta")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
