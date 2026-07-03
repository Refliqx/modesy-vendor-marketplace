"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ChevronDown, ChevronUp, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors cursor-pointer outline-none"
      >
        <span>{question}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 shrink-0 ms-2" /> : <ChevronDown size={16} className="text-gray-400 shrink-0 ms-2" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const t = useTranslations("helpPage");
  const locale = useLocale();

  const faqs: { q: string; a: string }[] = [
    { q: "faq1q", a: "faq1a" },
    { q: "faq2q", a: "faq2a" },
    { q: "faq3q", a: "faq3a" },
    { q: "faq4q", a: "faq4a" },
    { q: "faq5q", a: "faq5a" },
    { q: "faq6q", a: "faq6a" },
    { q: "faq7q", a: "faq7a" },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: t("title") }]} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white rounded-md border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <HelpCircle size={28} className="text-primary" />
            <h1 className="text-[28px] font-bold text-text-main">{t("title")}</h1>
          </div>
          <p className="text-text-main leading-relaxed text-sm mb-8">{t("p1")}</p>

          <h2 className="text-lg font-bold text-text-main mb-4">{t("faqTitle")}</h2>
          <div className="space-y-2 mb-10">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={t(faq.q)} answer={t(faq.a)} />
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-6 text-center border border-primary/10">
            <h3 className="text-base font-bold text-text-main mb-2">{t("contactTitle")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("contactText")}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 h-11 rounded-md transition-colors"
            >
              <Mail size={16} />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
