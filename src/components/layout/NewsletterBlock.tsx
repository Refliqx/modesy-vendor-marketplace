"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function NewsletterBlock() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t("successMessage"));
    setEmail("");
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg select-none font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0BAF9A] to-[#1B2333]" />
      <div className="relative py-12 px-6 text-center">
        <h3 className="text-white text-2xl font-bold">
          {t("title")}
        </h3>
        <p className="text-white/80 text-sm mt-2 max-w-md mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 mt-6 max-w-md mx-auto w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            className="flex-1 h-12 px-4 rounded-md text-sm bg-white text-text-main placeholder-placeholder border-0 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-sans"
          />
          <button
            type="submit"
            className="h-12 bg-white text-primary hover:bg-gray-50 hover:text-primary-hover font-semibold text-sm px-6 rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0 font-sans outline-none"
          >
            {t("subscribe")}
          </button>
        </form>
      </div>
    </div>
  );
}
