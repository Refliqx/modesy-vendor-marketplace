import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { 
  ShoppingBag, 
  FileText, 
  Download, 
  RotateCcw,
  Star,
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function OrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { tab = "orders" } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/callback`); // Or redirect to root with login modal trigger
  }

  // Fetch orders from database
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, total_price, payment_status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeTab = tab === "orders" || tab === "quotes" || tab === "downloads" || tab === "refunds" ? tab : "orders";

  const menuItems = [
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "quotes", label: "Quote Requests", icon: FileText },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "refunds", label: "Refund Requests", icon: RotateCcw },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50/50 min-h-screen">
      <Breadcrumb items={[
        { label: "Home", href: `/${locale}` },
        { label: "Orders" },
      ]} />

      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full">
        <h1 className="text-3xl font-bold text-text-main mb-8 font-sans">Orders</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg border border-gray-150 p-2 flex flex-col gap-1 shadow-sm">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/${locale}/orders?tab=${item.id}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition-colors",
                      isActive 
                        ? "bg-primary/5 text-primary" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-text-main"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 bg-white rounded-lg border border-gray-150 p-6 shadow-sm min-h-[400px] flex flex-col">
            {activeTab === "orders" && (
              <div className="flex-1 flex flex-col">
                {!orders || orders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag size={48} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-semibold mb-1">No records found!</p>
                    <p className="text-gray-400 text-xs max-w-xs">You haven't placed any orders yet. Visit the shop to add items to your cart.</p>
                    <Link href={`/${locale}/products`} className="mt-4 px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-md transition-colors">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Order</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Payment Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 text-sm text-text-main hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-primary">
                              #{order.order_number}
                            </td>
                            <td className="py-3.5 px-4 text-gray-500">
                              {new Date(order.created_at || "").toLocaleDateString(locale, {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </td>
                            <td className="py-3.5 px-4 font-bold">
                              ${order.total_price.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
                                order.payment_status === "paid" 
                                  ? "bg-green-50 text-green-700" 
                                  : "bg-amber-50 text-amber-700"
                              )}>
                                {order.payment_status || "pending"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link 
                                href={`/${locale}/order/${order.order_number}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-primary transition-colors"
                              >
                                <span>Details</span>
                                <ChevronRight size={14} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "quotes" && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <FileText size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-semibold">No records found!</p>
              </div>
            )}

            {activeTab === "downloads" && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <Download size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-semibold">No records found!</p>
              </div>
            )}

            {activeTab === "refunds" && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <RotateCcw size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-semibold">No records found!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
