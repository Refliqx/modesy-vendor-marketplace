"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Store, Package, DollarSign, TrendingUp, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { applyForVendorAction } from "@/actions/vendor.actions";

export default function SellNowPage() {
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    shopDescription: "",
  });

  const steps = [
    { icon: Store, label: "Shop Details" },
    { icon: Package, label: "Products" },
    { icon: DollarSign, label: "Pricing" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }

    setLoading(true);
    const fd = new FormData();
    fd.set("shopName", form.shopName);
    fd.set("shopDescription", form.shopDescription);

    const res = await applyForVendorAction(fd);
    if (res.error) { toast.error(res.error); setLoading(false); return; }

    toast.success("Your shop has been created!");
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 pb-12">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Sell Now" }]} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-text-main">Start Selling on Modesy</h1>
            <p className="text-sm text-gray-500 mt-2">Join thousands of sellers and reach millions of buyers worldwide.</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === i + 1;
              const isDone = step > i + 1;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive ? "bg-primary text-white" :
                    isDone ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {isDone ? <CheckCircle size={16} /> : <Icon size={16} />}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <ArrowRight size={16} className="text-gray-300 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-text-main">Tell us about your shop</h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Shop Name *</label>
                    <input
                      type="text"
                      name="shopName"
                      value={form.shopName}
                      onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                      placeholder="Your brand or shop name"
                      required
                      minLength={2}
                      className="w-full h-[52px] px-4 border border-border rounded-md text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Shop Description</label>
                    <textarea
                      name="shopDescription"
                      value={form.shopDescription}
                      onChange={(e) => setForm({ ...form, shopDescription: e.target.value })}
                      placeholder="Describe what you sell and what makes your shop unique"
                      rows={4}
                      className="w-full border border-border rounded-md p-4 text-sm text-text-main placeholder-placeholder focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-text-main">What will you sell?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["Fashion", "Home & Living", "Electronics", "Beauty", "Digital Products", "Handmade Crafts"].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        <input type="checkbox" className="accent-primary w-4 h-4" />
                        <span className="text-sm font-medium text-text-main">{cat}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">You can always add more categories later.</p>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-xl font-bold text-text-main">Set your pricing</h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <DollarSign size={20} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-text-main">Commission Rate: 5%</p>
                        <p className="text-xs text-gray-500 mt-1">Modesy charges a competitive 5% commission on each sale. You keep the rest.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
                      <TrendingUp size={20} className="text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-text-main">Free to list</p>
                        <p className="text-xs text-gray-500 mt-1">Listing products is completely free. You only pay when you make a sale.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                      <CheckCircle size={20} className="text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-text-main">Payouts: Weekly</p>
                        <p className="text-xs text-gray-500 mt-1">Get paid weekly for your sales. Withdraw directly to your bank account or PayPal.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="h-12 px-6 border border-gray-200 rounded-md text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  disabled={loading || (step === 1 && (!form.shopName || form.shopName.trim().length < 2))}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white h-12 px-8 rounded-md font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Submitting..." : step === 3 ? "Submit & Start Selling" : "Continue"}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have a shop?{" "}
            <Link href={`/${locale}/dashboard`} className="text-primary hover:underline font-medium">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
