"use client";

import { useCallback } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatPrice as formatPriceUtil } from "@/lib/format-price";

export function useFormatPrice() {
  const selected = useCurrencyStore((s) => s.selected);
  const _hasHydrated = useCurrencyStore((s) => s._hasHydrated);

  const format = useCallback(
    (amount: number) => {
      if (!_hasHydrated || !selected) return "";
      return formatPriceUtil(amount * (selected.exchange_rate ?? 1), selected.code);
    },
    [_hasHydrated, selected]
  );

  return format;
}
