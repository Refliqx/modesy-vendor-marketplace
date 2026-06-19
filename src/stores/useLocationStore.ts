import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationInfo {
  name: string;
  isoCode: string;
}

interface LocationStore {
  selectedCountry: LocationInfo | null;
  selectedState: LocationInfo | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setCountry: (country: LocationInfo | null) => void;
  setState: (state: LocationInfo | null) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      selectedCountry: null,
      selectedState: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setCountry: (country) => set({ selectedCountry: country, selectedState: null }),
      setState: (state) => set({ selectedState: state }),
      reset: () => set({ selectedCountry: null, selectedState: null }),
    }),
    {
      name: "location",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
