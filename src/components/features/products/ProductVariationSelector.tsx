"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OptionValue {
  id: number;
  option_id: number;
  value: string;
  price_modifier: number | null;
  stock: number | null;
}

export interface ProductOption {
  id: number;
  name: string;
  product_id: number;
  product_option_values: OptionValue[];
}

interface ProductVariationSelectorProps {
  options: ProductOption[];
  onChange: (selected: Record<number, OptionValue>) => void;
}

export function ProductVariationSelector({ options, onChange }: ProductVariationSelectorProps) {
  const [selected, setSelected] = useState<Record<number, OptionValue>>({});

  // Initialize with first value of each option if any
  useEffect(() => {
    const initial: Record<number, OptionValue> = {};
    options.forEach((opt) => {
      if (opt.product_option_values && opt.product_option_values.length > 0) {
        // Sort option values in some reasonable order or just pick the first
        const sortedValues = [...opt.product_option_values].sort((a, b) => a.id - b.id);
        const defaultVal = sortedValues[0];
        if (defaultVal) {
          initial[opt.id] = defaultVal;
        }
      }
    });
    setSelected(initial);
    onChange(initial);
  }, [options]);

  const handleSelect = (optionId: number, value: OptionValue) => {
    const next = { ...selected, [optionId]: value };
    setSelected(next);
    onChange(next);
  };

  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 w-full select-none mb-6">
      {options.map((opt) => {
        const selectedValue = selected[opt.id];
        return (
          <div key={opt.id} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1F2937] font-sans">
              {opt.name}:{" "}
              {selectedValue && (
                <span className="text-primary font-bold">{selectedValue.value}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {opt.product_option_values?.map((val) => {
                const isSelected = selectedValue?.id === val.id;
                const outOfStock = val.stock !== null && val.stock <= 0;

                return (
                  <button
                    key={val.id}
                    type="button"
                    disabled={outOfStock}
                    onClick={() => handleSelect(opt.id, val)}
                    className={cn(
                      "h-10 px-4 border rounded-md text-sm font-medium transition-all cursor-pointer font-sans relative",
                      isSelected
                        ? "border-primary text-primary bg-primary/5 ring-1 ring-primary"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                      outOfStock && "opacity-50 line-through cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400"
                    )}
                  >
                    {val.value}
                    {val.price_modifier && val.price_modifier !== 0 ? (
                      <span className="text-[10px] text-gray-400 ms-1">
                        ({val.price_modifier > 0 ? "+" : ""}
                        {val.price_modifier})
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
