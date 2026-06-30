import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { Wallet, Plus, Award, CreditCard, ArrowDownRight, ArrowUpRight, Wrench } from "lucide-react";
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
          {/* Add Funds Button */}
          <button 
            type="button" 
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-xs font-semibold rounded-md transition-all text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-sm"
          >
            <Plus size={14} className="text-gray-500" />
            <span>Add Funds</span>
          </button>

          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-3">
            <Wallet size={32} className="text-primary" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Wallet Balance</span>
          <span className="text-4xl font-extrabold text-text-main mt-1">$0</span>
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
            <div className="flex flex-col h-full justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Payment Id</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Deposit Amount</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="text-center py-16 text-gray-400 text-sm font-medium">
                No records found!
              </div>
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No referral earnings found!
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No expenses recorded!
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="text-center py-16 text-gray-400 text-sm font-medium">
              No payouts history found!
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
