import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Ticket } from "lucide-react";
import { dummyCoupons } from "@/lib/dummy/coupons";
import { CouponCard } from "./coupon-card";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CouponsPage({ params }: PageProps) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`);
  }

  const { data: dbCoupons } = await supabase.from("coupons").select("*").eq("is_active", true);
  const coupons: { code: string; discountPercent: number; label: string }[] = dbCoupons && dbCoupons.length > 0
    ? dbCoupons.map((c: any) => ({ code: c.code, discountPercent: c.discount_percent, label: c.code }))
    : dummyCoupons;

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "My Coupons" },
      ]} />

      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-main font-sans">My Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">Available coupon codes you can use at checkout.</p>
        </div>

        {coupons.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-150 p-12 text-center shadow-sm">
            <Ticket size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No coupons available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.code}
                code={coupon.code}
                discount={coupon.discountPercent}
                label={coupon.label}
              />
            ))}
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg border border-gray-150 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-text-main mb-3">How to use coupons</h2>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Copy the coupon code above or type it manually.</li>
            <li>Add products to your cart and proceed to checkout.</li>
            <li>Paste the coupon code in the &quot;Coupon&quot; field on the cart page.</li>
            <li>The discount will be applied automatically to your order total.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
