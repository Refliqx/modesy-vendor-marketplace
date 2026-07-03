"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, ChevronLeft, ChevronRight, Package, Store } from "lucide-react";
import { Country, State } from "country-state-city";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useCartItems } from "@/hooks/queries/useCartItems";
import { useFormatPrice } from "@/hooks/useFormatPrice";

export default function CheckoutShippingPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");
  const authT = useTranslations("auth");

  const user = useCartStore((s) => s.user);
  const { data: cartItems = [], isLoading } = useCartItems(locale, user?.id);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const shippingAddress = useCartStore((s) => s.shippingAddress);
  const setShippingAddress = useCartStore((s) => s.setShippingAddress);

  const openAuthModal = useAuthModalStore((s) => s.open);
  const formatPrice = useFormatPrice();

  const [form, setForm] = useState({
    firstName: shippingAddress?.firstName || "",
    lastName: shippingAddress?.lastName || "",
    email: shippingAddress?.email || "",
    phone: shippingAddress?.phone || "",
    country: shippingAddress?.country || "",
    state: shippingAddress?.state || "",
    city: shippingAddress?.city || "",
    zipCode: shippingAddress?.zipCode || "",
    address: shippingAddress?.address || "",
    useSameAddress: shippingAddress?.useSameAddress ?? true,
  });

  // List of countries for dropdown
  const countries = Country.getAllCountries();

  // List of states based on country
  const states = form.country 
    ? State.getStatesOfCountry(form.country) 
    : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, country: val, state: "" }));
  };

  // Group unique vendors from cart items
  const uniqueVendors = Array.from(
    new Map(
      cartItems.map((item) => [
        item.vendorId,
        {
          id: item.vendorId,
          shop_name: item.vendorName,
          shop_slug: item.vendorSlug,
          ship_from_country: item.shipFromCountry || "ID",
          ship_from_state: item.shipFromState || "Jakarta",
        },
      ])
    ).values()
  );

  // Validate shipping options for all vendors
  const vendorShippingStatuses = uniqueVendors.map((vendor) => {
    if (!form.country) {
      return { vendor, hasShipping: false, isError: false };
    }
    // Compare chosen country code with vendor ship_from_country
    const isMatch = form.country.toUpperCase() === vendor.ship_from_country.toUpperCase();
    return {
      vendor,
      hasShipping: isMatch,
      isError: !isMatch,
    };
  });

  const hasNoDeliveryError = vendorShippingStatuses.some((status) => status.isError);
  const showShippingMethods = !!form.country;

  // Validation checking for all form fields
  const isFormFilled = 
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.country.trim() !== "" &&
    form.state.trim() !== "" &&
    form.city.trim() !== "" &&
    form.zipCode.trim() !== "" &&
    form.address.trim() !== "";

  // Show "Continue to Payment" button ONLY if there are no "no delivery" errors
  const showContinueButton = !hasNoDeliveryError && showShippingMethods;

  // Shipping Fee calculation ($10 flat rate per matched vendor)
  const shippingFee = showShippingMethods && !hasNoDeliveryError
    ? uniqueVendors.length * 10
    : 0;

  // Math totals
  const subtotal = cartItems.reduce((sum, item) => {
    const unitPrice = item.discountPercent != null 
      ? item.price - (item.price * item.discountPercent) / 100 
      : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon 
    ? (subtotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const total = subtotal - discountAmount + shippingFee;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormFilled || hasNoDeliveryError) return;
    setShippingAddress(form);
    router.push(`/${locale}/cart/payment`);
  };

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      router.replace(`/${locale}/cart`);
    }
  }, [cartItems, isLoading, locale, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Cart", href: `/${locale}/cart` }, { label: "Checkout" }]} />
        <div className="flex-1 flex items-center justify-center py-24 select-none">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Cart", href: `/${locale}/cart` },
        { label: "Checkout" }
      ]} />

      <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Page Header */}
        <h1 className="text-[28px] font-bold text-text-main mb-2">Checkout</h1>
        
        {/* Guest checkout Notice */}
        {!user && (
          <p className="text-sm text-gray-600 mb-8 font-sans">
            You are checking out as a guest. Have an account?{" "}
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="text-primary font-semibold hover:underline cursor-pointer outline-none"
            >
              Login
            </button>
          </p>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-6">
          {/* Checkout Steps Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-bold text-text-main border-b border-gray-100 pb-3 mb-5 font-sans">
                1. Shipping Information
              </h2>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-text-main font-sans">Shipping Address</p>
                
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    required
                    value={form.country}
                    onChange={handleCountryChange}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main bg-white focus:outline-none focus:border-primary font-sans"
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    required
                    disabled={!form.country}
                    value={form.state}
                    onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main bg-white focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Zip Code"
                    value={form.zipCode}
                    onChange={(e) => setForm((p) => ({ ...p, zipCode: e.target.value }))}
                    className="h-[52px] border border-gray-200 rounded-md px-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                </div>

                <div>
                  <textarea
                    required
                    placeholder="Full Address"
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    rows={2}
                    className="w-full min-h-[80px] border border-gray-200 rounded-md p-3 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 select-none">
                  <input
                    type="checkbox"
                    id="useSameAddress"
                    checked={form.useSameAddress}
                    onChange={(e) => setForm((p) => ({ ...p, useSameAddress: e.target.checked }))}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="useSameAddress" className="text-sm text-gray-600 cursor-pointer font-sans">
                    Use same address for billing address
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method Section */}
            {showShippingMethods && (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-text-main mb-4 font-sans">Shipping Method</h3>
                
                <div className="space-y-4">
                  {vendorShippingStatuses.map(({ vendor, hasShipping, isError }) => (
                    <div key={vendor.id} className="bg-white border border-gray-150 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-text-main mb-3 font-sans">
                        <Store size={16} className="text-primary" />
                        <span>{vendor.shop_name}</span>
                      </div>

                      {hasShipping ? (
                        <div className="flex items-center justify-between border border-primary bg-primary/5 rounded-md p-3.5 select-none">
                          <div className="flex items-center gap-3">
                            {/* Checkbox / Radio indicator */}
                            <div className="w-5 h-5 rounded-full border border-primary bg-primary flex items-center justify-center text-white shrink-0">
                              <span className="text-[10px] font-bold">✓</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-main font-sans">Flat Rate</p>
                              <p className="text-xs text-gray-500 font-sans">Standard shipping</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-primary font-sans">$10.00</span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 text-red-500 font-medium p-1 select-none font-sans">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-600 font-semibold font-sans">No delivery</p>
                            <p className="text-xs text-red-500/85 font-sans mt-0.5">
                              No delivery is made to the address you have chosen.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-2">
              <Link
                href={`/${locale}/cart`}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors underline font-medium"
              >
                <ChevronLeft size={16} />
                Return to cart
              </Link>

              {showContinueButton && (
                <button
                  type="submit"
                  disabled={!isFormFilled}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white h-12 px-6 rounded-md font-semibold text-sm transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  Continue to Payment Method
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Sticky Order Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border border-gray-150 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="font-semibold text-base text-text-main pb-4 border-b border-gray-100 mb-4 font-sans">
                Order Summary ({totalItemCount})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1 no-scrollbar mb-4">
                {cartItems.map((item) => {
                  const unitPrice = item.discountPercent != null 
                    ? item.price - (item.price * item.discountPercent) / 100 
                    : item.price;
                  const itemImg = `https://picsum.photos/seed/product-${item.productId}/100/100`;

                  return (
                    <div key={item.id} className="flex gap-3 py-3 select-none">
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-50 shrink-0 border border-gray-100 relative">
                        <Image
                          src={itemImg}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-text-main line-clamp-1 font-sans">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                          Color: Dark &nbsp; Size: S
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 font-sans mt-0.5">
                          Seller: {item.vendorName}
                        </p>
                        <div className="flex items-center justify-between mt-1 select-none">
                          <span className="text-[11px] text-gray-500 font-sans">Qty: {item.quantity}</span>
                          <span className="text-[11px] font-bold text-text-main font-sans">
                            {formatPrice(unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal, Shipping, Discount lines */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-main">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (-{appliedCoupon.label})</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-text-main">
                    {shippingFee > 0 ? formatPrice(shippingFee) : "—"}
                  </span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="flex justify-between font-bold text-lg text-text-main font-sans">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
