"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { CartItemRow } from "@/components/features/cart/CartItemRow";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useCartItems } from "@/hooks/queries/useCartItems";
import { useUpdateCartQty, useRemoveFromCart } from "@/hooks/queries/useCartMutations";
import { validateCoupon } from "@/lib/dummy/coupons";
import { toast } from "sonner";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/lib/utils";

interface CartPageViewProps {
  userId?: string | null;
}

export function CartPageView({ userId }: CartPageViewProps) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const openAuthModal = useAuthModalStore((s) => s.open);
  
  const user = useCartStore((s) => s.user);
  const { data: cartItems = [], isLoading } = useCartItems(locale, user?.id ?? userId);
  const { mutateAsync: updateQty } = useUpdateCartQty();
  const { mutateAsync: removeItem } = useRemoveFromCart();
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const setAppliedCoupon = useCartStore((s) => s.setAppliedCoupon);
  const formatPrice = useFormatPrice();

  const handleQuantityChange = useCallback((id: number, qty: number) => {
    updateQty({ itemId: id, quantity: qty, locale });
  }, [updateQty, locale]);

  const handleRemove = useCallback((id: number) => {
    removeItem({ itemId: id, locale });
  }, [removeItem, locale]);

  const handleApplyCoupon = useCallback((code: string) => {
    const coupon = validateCoupon(code);
    if (coupon) {
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      return true;
    } else {
      toast.error("Invalid coupon code");
      return false;
    }
  }, [setAppliedCoupon]);

  const groupedItems = useMemo(() => cartItems.reduce((groups, item) => {
    const vendorId = item.vendorId;
    if (!groups[vendorId]) {
      groups[vendorId] = {
        vendorName: item.vendorName,
        vendorSlug: item.vendorSlug,
        items: []
      };
    }
    groups[vendorId].items.push(item);
    return groups;
  }, {} as Record<number, { vendorName: string; vendorSlug: string; items: typeof cartItems }>), [cartItems]);

  const uniqueVendorsCount = Object.keys(groupedItems).length;
  const shippingFee = uniqueVendorsCount * 10;

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => {
    const unitPrice = item.discountPercent != null 
      ? item.price - (item.price * item.discountPercent) / 100 
      : item.price;
    return sum + unitPrice * item.quantity;
  }, 0), [cartItems]);

  const discountAmount = appliedCoupon 
    ? (subtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const total = subtotal - discountAmount + shippingFee;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // If loading and cart is empty (e.g. initial fetch)
  if (isLoading && cartItems.length === 0) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Cart" }]} />
        <div className="flex-1 flex items-center justify-center py-24 select-none">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Render Empty State if no items
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col flex-1 select-none">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Cart" }]} />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 bg-gray-50 border border-gray-150 rounded-full flex items-center justify-center shadow-inner mb-6">
            <ShoppingCart size={36} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-text-main">Your cart is empty!</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs text-center font-sans">
            Add products to your cart and start shopping.
          </p>
          <Link
            href={`/${locale}`}
            className="bg-primary hover:bg-primary-hover text-white px-8 h-11 rounded-md font-semibold mt-6 flex items-center justify-center transition-colors shadow-sm cursor-pointer text-sm font-sans"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Cart" }]} />
      
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        <h1 className="text-[28px] font-bold text-text-main mb-8">My Cart ({totalItemCount})</h1>
        
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Cart Items Grouped by Vendor */}
          <div className="flex flex-col gap-6">
            {Object.entries(groupedItems).map(([vendorId, group]) => (
              <div key={vendorId} className="border border-gray-150 rounded-lg p-5 bg-white shadow-sm">
                {/* Group Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4 font-sans">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {group.vendorName[0]}
                  </div>
                  <Link 
                    href={`/${locale}/profile/${group.vendorSlug}`} 
                    className="font-semibold text-text-main text-sm hover:text-primary transition-colors"
                  >
                    {group.vendorName}
                  </Link>
                </div>
                {/* Items list */}
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
                {/* Group Footer: Shipping Cost */}
                <div className="flex justify-end pt-4 mt-2 text-sm text-gray-500 font-sans">
                  Shipping for {group.vendorName}: <span className="font-bold text-text-main ms-1">{formatPrice(10)}</span>
                </div>
              </div>
            ))}
            
            <Link
              href={`/${locale}`}
              className="mt-2 flex items-center gap-1 text-gray-500 hover:text-primary transition-colors text-sm font-medium w-fit"
            >
              <ChevronLeft size={16} />
              Keep Shopping
            </Link>
          </div>
          
          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border border-gray-150 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="font-semibold text-base text-text-main pb-4 border-b border-gray-100 mb-4 font-sans">
                Order Summary
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between font-sans">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-main">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between font-sans">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-text-main">{formatPrice(shippingFee)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-sans">
                    <span>Discount (-{appliedCoupon.label})</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>
              
              <hr className="my-4 border-gray-100" />
              
              <div className="flex justify-between font-bold text-lg text-text-main font-sans">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <CouponInput onApply={handleApplyCoupon} />

              {/* Checkout Button */}
              {user ? (
                <Link
                  href={`/${locale}/cart/shipping`}
                  className="w-full bg-primary hover:bg-primary-hover text-white h-12 rounded-md font-semibold mt-6 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-sm shadow-sm font-sans"
                >
                  Checkout →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Please login to proceed to checkout");
                    openAuthModal();
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white h-12 rounded-md font-semibold mt-6 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-sm shadow-sm font-sans outline-none"
                >
                  Checkout →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CouponInput({ onApply }: { onApply: (code: string) => boolean }) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);

  const handleApplyCoupon = () => {
    const valid = onApply(couponInput);
    if (valid) {
      setCouponError(false);
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 1000);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-5">
      <label className="block text-sm font-semibold text-text-main mb-2 font-sans">
        Discount Coupon
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          placeholder="Coupon Code"
          className={cn(
            "flex-1 h-11 px-3 border rounded-md text-sm text-text-main bg-white placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans",
            couponError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200"
          )}
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 h-11 rounded-md transition-colors cursor-pointer outline-none"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
