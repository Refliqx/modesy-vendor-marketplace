"use client";

import { useState } from "react";
import { Copy, CheckCircle, Ticket } from "lucide-react";
import { toast } from "sonner";

interface CouponCardProps {
  code: string;
  discount: number;
  label: string;
}

export function CouponCard({ code, discount, label }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-150 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Ticket size={20} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coupon</span>
        </div>
        <p className="text-2xl font-extrabold text-text-main font-mono tracking-wider">{code}</p>
      </div>
      <div className="p-4">
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-extrabold text-primary">{discount}%</span>
          <span className="text-sm text-gray-500">OFF</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyCode}
            className="flex-1 flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-md text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors bg-white cursor-pointer"
          >
            {copied ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
