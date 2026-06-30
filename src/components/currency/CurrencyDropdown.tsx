import { useState, useRef } from "react";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyDropdownProps {
  className?: string;
}

export function CurrencyDropdown({ className }: CurrencyDropdownProps) {
  const currencies = useCurrencyStore((s) => s.currencies);
  const selected = useCurrencyStore((s) => s.selected);
  const setSelected = useCurrencyStore((s) => s.setSelected);
  const _hasHydrated = useCurrencyStore((s) => s._hasHydrated);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  if (!_hasHydrated || !selected) {
    return (
      <div className={cn("flex items-center gap-1 opacity-80 cursor-not-allowed", className || "text-white text-[13px]")}>
        <span>USD ($)</span>
        <ChevronDown size={12} className="opacity-60" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer outline-none",
          className || "text-white text-[13px]"
        )}
      >
        <span>{selected.code} ({selected.symbol})</span>
        <ChevronDown size={12} className="opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg min-w-[190px] z-50 flex flex-col overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-thin py-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  setSelected(currency);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer font-sans text-[14px] text-start transition-colors",
                  selected.code === currency.code ? "text-primary font-medium bg-primary/5" : "text-gray-700"
                )}
              >
                <span>
                  {currency.code} ({currency.symbol})
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


