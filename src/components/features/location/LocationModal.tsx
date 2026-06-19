import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Check, ChevronDown } from "lucide-react";
import { Country, State } from "country-state-city";
import { useLocationStore } from "@/stores/useLocationStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const t = useTranslations("topbar");
  const { selectedCountry, selectedState, setCountry, setState, reset, _hasHydrated } = useLocationStore();

  const [tempCountry, setTempCountry] = useState<{ name: string; isoCode: string } | null>(null);
  const [tempState, setTempState] = useState<{ name: string; isoCode: string } | null>(null);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempCountry(selectedCountry);
      setTempState(selectedState);
    }
  }, [isOpen, selectedCountry, selectedState]);

  if (!isOpen || !_hasHydrated) return null;

  const countries = Country.getAllCountries();
  const states = tempCountry ? State.getStatesOfCountry(tempCountry.isoCode) : [];

  const handleApply = () => {
    setCountry(tempCountry);
    setState(tempState);
    onClose();
  };

  const handleClear = () => {
    reset();
    setTempCountry(null);
    setTempState(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-y-auto px-4">
      <div className="relative bg-white rounded-xl max-w-sm w-full mt-24 mx-4 sm:mx-auto p-6 shadow-2xl font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-placeholder hover:text-text-main cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-text-main">
          {t("selectLocation")}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">
              {t("country")}
            </span>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full h-[52px] border border-border rounded-md px-4 flex justify-between items-center text-sm text-text-main bg-white hover:bg-gray-50 focus:outline-none focus:border-primary transition-all text-start"
                >
                  <span className="truncate">
                    {tempCountry ? tempCountry.name : t("selectCountry")}
                  </span>
                  <ChevronDown size={16} className="text-placeholder ms-2 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[336px] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t("searchCountry")} />
                  <CommandList>
                    <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {countries.map((c) => (
                        <CommandItem
                          key={c.isoCode}
                          value={c.name}
                          onSelect={() => {
                            setTempCountry({ name: c.name, isoCode: c.isoCode });
                            setTempState(null);
                            setCountryOpen(false);
                          }}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          <span className="truncate">{c.name}</span>
                          {tempCountry?.isoCode === c.isoCode && (
                            <Check size={16} className="text-primary ms-2 shrink-0" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {tempCountry && states.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-text-muted">
                {t("state")}
              </span>
              <Popover open={stateOpen} onOpenChange={setStateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-[52px] border border-border rounded-md px-4 flex justify-between items-center text-sm text-text-main bg-white hover:bg-gray-50 focus:outline-none focus:border-primary transition-all text-start"
                  >
                    <span className="truncate">
                      {tempState ? tempState.name : t("selectState")}
                    </span>
                    <ChevronDown size={16} className="text-placeholder ms-2 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[336px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("searchState")} />
                    <CommandList>
                      <CommandEmpty>{t("noStateFound")}</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {states.map((s) => (
                          <CommandItem
                            key={s.isoCode}
                            value={s.name}
                            onSelect={() => {
                              setTempState({ name: s.name, isoCode: s.isoCode });
                              setStateOpen(false);
                            }}
                            className="flex justify-between items-center cursor-pointer"
                          >
                            <span className="truncate">{s.name}</span>
                            {tempState?.isoCode === s.isoCode && (
                              <Check size={16} className="text-primary ms-2 shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            className="w-full h-[52px] bg-primary hover:bg-primary-hover text-white font-semibold rounded-md flex items-center justify-center cursor-pointer transition-colors mt-2"
          >
            {t("applyLocation")}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-primary hover:text-primary-hover text-sm font-medium transition-colors cursor-pointer text-center"
          >
            {t("clearLocation")}
          </button>
        </div>
      </div>
    </div>
  );
}
