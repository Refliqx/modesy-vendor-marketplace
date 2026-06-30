"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductReviews } from "./ProductReviews";
import { Country, State } from "country-state-city";
import { useTranslations } from "next-intl";

interface ProductTabsProps {
  product: {
    id: number;
    slug: string;
    price: number;
    discount_percent: number | null;
    stock: number;
    type: string;
    product_translations: { title: string; description: string; short_description: string | null }[] | { title: string; description: string; short_description: string | null } | null;
    weight: number | null;
    vendor_id: number | null;
  };
  reviews: any[];
}

export function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [selectedStateIso, setSelectedStateIso] = useState("");

  const t = useTranslations("shippingTab");

  const translations = product.product_translations;
  const translation = Array.isArray(translations) ? translations[0] : translations;
  const description = translation?.description || "";

  const tabs = [
    { id: "description", label: "Description" },
    { id: "additional", label: "Additional Info" },
    { id: "shipping", label: "Shipping & Location" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
    { id: "comments", label: "Comments (0)" },
  ];

  return (
    <div className="mt-8 select-none">
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer outline-none",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {activeTab === "description" && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description || "No description available."}</p>
            <button type="button" className="text-xs text-gray-400 underline mt-3 hover:text-gray-600 cursor-pointer outline-none">
              Report this product
            </button>
          </div>
        )}

        {activeTab === "additional" && (
          <table className="w-full text-sm border-collapse">
            <tbody>
              {[
                { label: "SKU", value: `MD-${product.id}` },
                { label: "Weight", value: product.weight ? `${product.weight} g` : "N/A" },
                { label: "Condition", value: "New" },
              ].map((row, idx) => (
                <tr key={idx} className={cn(idx % 2 === 0 && "bg-gray-50")}>
                  <td className="py-2.5 px-3 font-medium text-gray-700 w-1/3">{row.label}</td>
                  <td className="py-2.5 px-3 text-gray-600">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "shipping" && (
          <div className="flex flex-col gap-6 w-full text-start">
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3 align-top">{t("shippingCost")}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex flex-col gap-3">
                        <span className="font-semibold text-text-main text-xs uppercase tracking-wider">{t("selectLocation")}</span>
                        <div className="flex flex-wrap gap-3">
                          <select
                            value={selectedCountryIso}
                            onChange={(e) => {
                              setSelectedCountryIso(e.target.value);
                              setSelectedStateIso("");
                            }}
                            className="h-[40px] px-3 border border-gray-200 rounded-md text-sm text-text-main placeholder-placeholder bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 min-w-[180px] cursor-pointer"
                          >
                            <option value="">{t("selectCountry")}</option>
                            {Country.getAllCountries().map((c) => (
                              <option key={c.isoCode} value={c.isoCode}>
                                {c.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={selectedStateIso}
                            onChange={(e) => setSelectedStateIso(e.target.value)}
                            disabled={!selectedCountryIso}
                            className="h-[40px] px-3 border border-gray-200 rounded-md text-sm text-text-main placeholder-placeholder bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">{t("selectState")}</option>
                            {selectedCountryIso &&
                              State.getStatesOfCountry(selectedCountryIso).map((s) => (
                                <option key={s.isoCode} value={s.isoCode}>
                                  {s.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        <div className="text-xs font-medium text-gray-500 mt-1">
                          {selectedCountryIso ? (
                            <span>
                              {t("calculatedShipping", {
                                country: Country.getCountryByCode(selectedCountryIso)?.name || "",
                                state: selectedStateIso ? State.getStateByCodeAndCountry(selectedStateIso, selectedCountryIso)?.name || "" : "Any State",
                                cost: selectedCountryIso === "US" ? "$5.00" : "$15.00",
                              })}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">Select a country to estimate shipping costs</span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t("shipping")}</td>
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      {t("readyToShip")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t("productLocation")}</td>
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      Florida, United States
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full rounded-md border border-gray-200 overflow-hidden shadow-sm aspect-[21/9] min-h-[300px]">
              <iframe
                src="https://maps.google.com/maps?q=Florida%2C%20United%20States&t=&z=7&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <ProductReviews productId={product.id} initialReviews={reviews} />
        )}

        {activeTab === "comments" && (
          <div>
            <p className="text-sm text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
            <textarea
              placeholder="Write a comment..."
              rows={3}
              className="w-full border border-border rounded-md p-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mb-3"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="bg-primary text-white h-10 px-6 rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Post Comment
              </button>
              <p className="text-xs text-gray-400">Verification is required</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
