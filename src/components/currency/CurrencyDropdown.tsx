import { useState, useRef } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Check, ChevronDown } from "lucide-react";

export function CurrencyDropdown() {
  const { currencies, selected, setSelected, _hasHydrated } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  if (!_hasHydrated || !selected) {
    return (
      <div className="flex items-center gap-1 text-white text-[13px] opacity-80 cursor-not-allowed">
        <span>$ USD</span>
        <ChevronDown size={12} className="opacity-60" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:underline hover:opacity-80 transition-opacity cursor-pointer outline-none text-white text-[13px]"
      >
        <span>{selected.symbol} {selected.code}</span>
        <ChevronDown size={12} className="opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg min-w-[180px] max-h-72 overflow-y-auto z-50 scrollbar-thin">
          <div className="py-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  setSelected(currency);
                  setIsOpen(false);
                }}
                className={`w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-sans text-[14px] text-start ${
                  selected.code === currency.code ? "text-primary font-medium" : "text-gray-700"
                }`}
              >
                <span>
                  {currency.symbol} {currency.code}
                </span>
                {selected.code === currency.code && (
                  <Check size={14} className="text-primary ms-2 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
