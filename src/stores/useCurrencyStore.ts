import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Database } from "@/types/supabase";

type Currency = Database["public"]["Tables"]["currencies"]["Row"];

interface CurrencyStore {
  currencies: Currency[];
  selected: Currency | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setCurrencies: (currencies: Currency[]) => void;
  setSelected: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currencies: [],
      selected: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setCurrencies: (currencies) =>
        set((state) => {
          const defaultCurrency = currencies.find((c) => c.is_default) || currencies[0] || null;
          return {
            currencies,
            selected: state.selected && currencies.some((c) => c.code === state.selected?.code)
              ? currencies.find((c) => c.code === state.selected?.code) || null
              : defaultCurrency,
          };
        }),
      setSelected: (selected) => set({ selected }),
    }),
    {
      name: "currency",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
