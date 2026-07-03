import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getWalletData } from "@/actions/wallet.actions";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Wallet, Plus, Award, CreditCard, ArrowDownRight, ArrowUpRight, Wrench, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function WalletPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { tab = "deposits" } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`);
  }

  const walletData = await getWalletData();
  const balance = walletData?.balance ?? 0;
  const vendor = walletData?.vendor ?? null;
  const deposits = walletData?.deposits ?? [];
  const expenses = walletData?.expenses ?? [];

  const activeTab = tab === "referrals" || tab === "deposits" || tab === "expenses" || tab === "payouts" || tab === "settings" ? tab : "deposits";

  const tabsList = [
    { id: "referrals", label: "Referral Earnings", icon: Award },
    { id: "deposits", label: "Deposits", icon: CreditCard },
    { id: "expenses", label: "Expenses", icon: ArrowDownRight },
    { id: "payouts", label: "Payouts", icon: ArrowUpRight },
    { id: "settings", label: "Set Payout Account", icon: Wrench },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Wallet" },
      ]} />

      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full">
        <h1 className="text-3xl font-bold text-text-main mb-8 font-sans">Wallet</h1>

        {/* Wallet Balance Hero Card */}
        <div className="bg-white rounded-lg border border-gray-150 p-8 shadow-sm flex flex-col items-center justify-center relative mb-8 max-w-2xl mx-auto">
          {vendor && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-gray-500">
              <Store size={14} className="text-primary" />
              <span className="font-semibold">{vendor.shop_name}</span>
            </div>
          )}
          <button
            type="button"
            className="absolute top-4 end-4 flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-xs font-semibold rounded-md transition-all text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm"
          >
            <Plus size={14} className="text-gray-500" />
            <span>Add Funds</span>
          </button>

          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-3">
            <Wallet size={32} className="text-primary" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Wallet Balance</span>
          <span className="text-4xl font-extrabold text-text-main mt-1">
            ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {vendor && (
            <p className="text-xs text-gray-400 mt-2">
              {vendor.is_verified ? "Verified Seller" : "Seller account"}
            </p>
          )}
        </div>

        {/* Tabs Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 border-b border-gray-150 pb-6">
          {tabsList.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <Link
                key={t.id}
                href={`/${locale}/wallet?tab=${t.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all shadow-sm border cursor-pointer",
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Tab content area */}
        <div className="bg-white rounded-lg border border-gray-150 p-6 shadow-sm min-h-[300px]">
          {activeTab === "deposits" && (
            <div>
              {deposits.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm font-medium">
                  No deposits yet. Earnings from sales will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Commission</th>
                        <th className="py-3 px-4">Earning</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {deposits.map((d: any) => {
                        const title = d.products?.product_translations?.[0]?.title || `Product #${d.product_id}`;
                        const earning = d.vendor_earning ?? (d.price * d.quantity);
                        const commission = d.commission_amount ?? 0;
                        return (
                          <tr key={d.id} className="hover:bg-gray-50/50 text-sm">
                            <td className="py-3 px-4 font-mono text-xs text-gray-500">{d.orders?.order_number || "—"}</td>
                            <td className="py-3 px-4 text-text-main font-medium max-w-[180px] truncate">{title}</td>
                            <td className="py-3 px-4 text-text-main">${Number(d.price * d.quantity).toFixed(2)}</td>
                            <td className="py-3 px-4 text-gray-500">${Number(commission).toFixed(2)}</td>
                            <td className="py-3 px-4 text-green-600 font-semibold">+${Number(earning).toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={cn(
                                "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold",
                                d.order_status === "delivered" ? "bg-green-100 text-green-700" :
                                d.order_status === "paid" || d.order_status === "processing" ? "bg-blue-100 text-blue-700" :
                                d.order_status === "shipped" ? "bg-purple-100 text-purple-700" :
                                "bg-yellow-100 text-yellow-700"
                              )}>
                                {d.order_status || "pending"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-400">
                              {d.created_at ? new Date(d.created_at).toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No referral earnings found!
            </div>
          )}

          {activeTab === "expenses" && (
            <div>
              {expenses.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm font-medium">
                  No expenses recorded. Your order history will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {expenses.map((o: any) => (
                        <tr key={o.id} className="hover:bg-gray-50/50 text-sm">
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">{o.order_number}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {o.order_items?.length || 0} item{(o.order_items?.length || 0) !== 1 ? "s" : ""}
                          </td>
                          <td className="py-3 px-4 text-text-main font-medium">
                            ${Number(o.total_price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-500">{o.payment_method || "—"}</td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold",
                              o.payment_status === "paid" ? "bg-green-100 text-green-700" :
                              o.payment_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              o.payment_status === "failed" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-700"
                            )}>
                              {o.payment_status || "pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-400">
                            {o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No payouts history found. Withdrawals will appear here once processed.
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-md mx-auto py-6">
              <h3 className="text-lg font-bold text-text-main mb-4 font-sans">Payout Account Settings</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payout Method</label>
                  <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:border-primary">
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">PayPal Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled
                  className="w-full h-10 bg-primary/70 text-white font-semibold rounded-md text-sm cursor-not-allowed"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
