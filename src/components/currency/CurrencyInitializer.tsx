"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import type { Database } from "@/types/supabase";

type Currency = Database["public"]["Tables"]["currencies"]["Row"];

export function CurrencyInitializer({ currencies }: { currencies: Currency[] }) {
  useEffect(() => {
    useCurrencyStore.getState().setCurrencies(currencies);
  }, []);

  return null;
}