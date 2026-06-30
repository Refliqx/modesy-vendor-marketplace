"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { fetchAndUpdateExchangeRates } from "@/actions/currency.actions";
import type { Database } from "@/types/supabase";

type Currency = Database["public"]["Tables"]["currencies"]["Row"];

export function CurrencyInitializer({ currencies }: { currencies: Currency[] }) {
  useEffect(() => {
    const store = useCurrencyStore.getState();
    store.setCurrencies(currencies);

    const checkAndSyncExchangeRates = async () => {
      // Find a currency to check when rates were last updated (excluding defaults if needed, but any status=true is fine)
      const sampleCurrency = currencies.find(c => c.code !== "USD") || currencies[0];
      if (!sampleCurrency) return;

      const updatedAt = sampleCurrency.updated_at;
      let shouldSync = false;

      if (!updatedAt) {
        shouldSync = true;
      } else {
        const lastUpdated = new Date(updatedAt).getTime();
        const now = Date.now();
        const ageInMs = now - lastUpdated;
        const twelveHoursInMs = 12 * 60 * 60 * 1000;
        if (ageInMs > twelveHoursInMs) {
          shouldSync = true;
        }
      }

      if (shouldSync) {
        try {
          const res = await fetchAndUpdateExchangeRates();
          if (res.success && res.rates) {
            // Update the local Zustand store with the new rates immediately
            const currentCurrencies = useCurrencyStore.getState().currencies;
            const updatedCurrencies = currentCurrencies.map((c) => {
              if (res.rates && res.rates[c.code] !== undefined) {
                return {
                  ...c,
                  exchange_rate: Number(res.rates[c.code]),
                  updated_at: new Date().toISOString(),
                };
              }
              return c;
            });
            useCurrencyStore.getState().setCurrencies(updatedCurrencies);
          } else if (res.error) {
            console.error("Background exchange rates sync failed:", res.error);
          }
        } catch (error) {
          console.error("Failed to run background exchange rates sync:", error);
        }
      }
    };

    checkAndSyncExchangeRates();
  }, [currencies]);

  return null;
}