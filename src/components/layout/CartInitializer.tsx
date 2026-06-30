"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useCartStore } from "@/stores/useCartStore";

export function CartInitializer() {
  const locale = useLocale();
  const initializeAuth = useCartStore((state) => state.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth(locale);
    return () => {
      unsubscribe();
    };
  }, [initializeAuth, locale]);

  return null;
}
