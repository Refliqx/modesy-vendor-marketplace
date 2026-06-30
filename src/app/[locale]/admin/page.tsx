"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Store, Package, ShoppingBag, DollarSign, CheckCircle, XCircle,
  Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useCartStore } from "@/stores/useCartStore";
import {
  getPendingVendors, approveVendorAction,
  getAllProductsAdmin, moderateProductAction,
  getAllCurrenciesAdmin, updateCurrencyAction
} from "@/actions/vendor.actions";
import { getOrdersForAdmin } from "@/actions/order-status.actions";
import { toast } from "sonner";

type Tab = "vendors" | "products" | "orders" | "currencies";

export default function AdminDashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const user = useCartStore((s) => s.user);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("vendors");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push(`/${locale}`); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [v, p, o, c] = await Promise.all([
      getPendingVendors(),
      getAllProductsAdmin(),
      getOrdersForAdmin(),
      getAllCurrenciesAdmin(),
    ]);
    setVendors(v);
    setProducts(p);
    setOrders(o.orders);
    setCurrencies(c);
    setLoading(false);
  };

  const handleApproveVendor = async (vendorId: number, approve: boolean) => {
    const res = await approveVendorAction(vendorId, approve);
    if (res.error) { toast.error(res.error); return; }
    toast.success(approve ? "Vendor approved" : "Vendor rejected");
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, is_verified: approve, status: approve } : v));
  };

  const handleModerateProduct = async (productId: number, status: boolean, isDraft: boolean) => {
    const res = await moderateProductAction(productId, status, isDraft);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Product moderated");
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status, is_draft: isDraft } : p));
  };

  const handleUpdateCurrency = async (currencyId: number, exchangeRate: number, status: boolean) => {
    const res = await updateCurrencyAction(currencyId, exchangeRate, status);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Currency updated");
    loadAll();
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Admin" }]} />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-blue-100 text-blue-700",
      processing: "bg-indigo-100 text-indigo-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", colors[status] || "bg-gray-100 text-gray-700")}>
        {status}
      </span>
    );
  };

  const tabs: Tab[] = ["vendors", "products", "orders", "currencies"];

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Admin Dashboard" }]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full">
        <h1 className="text-2xl font-bold text-text-main mb-6">Admin Dashboard</h1>

        {/* Tab bar */}
        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-medium capitalize whitespace-nowrap transition-colors cursor-pointer outline-none",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "vendors" && (
          <div className="space-y-3">
            {vendors.length === 0 ? (
              <div className="border border-gray-100 rounded-lg p-8 text-center text-sm text-gray-400 bg-white shadow-sm">
                No pending vendors.
              </div>
            ) : (
              vendors.map(v => (
                <div key={v.id} className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-primary" />
                      <span className="font-semibold text-text-main">{v.shop_name}</span>
                      {v.is_verified ? (
                        <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Verified</span>
                      ) : (
                        <span className="text-[11px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                      )}
                    </div>
                    {v.shop_description && <p className="text-xs text-gray-400 mt-1">{v.shop_description}</p>}
                  </div>
                  <div className="flex gap-2">
                    {!v.is_verified && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveVendor(v.id, true)}
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-600 font-semibold px-3 h-8 rounded-md hover:bg-green-100 transition-colors cursor-pointer outline-none"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveVendor(v.id, false)}
                          className="flex items-center gap-1 text-xs bg-red-50 text-red-600 font-semibold px-3 h-8 rounded-md hover:bg-red-100 transition-colors cursor-pointer outline-none"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
            {products.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No products found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-text-main">{p.product_translations?.[0]?.title || p.slug}</p>
                        <p className="text-[11px] text-gray-400">MD-{p.id}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.vendors?.shop_name || "—"}</td>
                      <td className="py-3 px-4 text-text-main font-medium">${Number(p.price).toFixed(2)}</td>
                      <td className="py-3 px-4">{statusBadge(p.status ? "active" : p.is_draft ? "draft" : "inactive")}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleModerateProduct(p.id, !p.status, p.is_draft)}
                            className={cn(
                              "w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer",
                              p.status ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                            )}
                            title={p.status ? "Deactivate" : "Activate"}
                          >
                            {p.status ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleModerateProduct(p.id, true, !p.is_draft)}
                            className={cn(
                              "w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer",
                              p.is_draft ? "bg-yellow-50 text-yellow-600" : "bg-blue-50 text-blue-600"
                            )}
                            title={p.is_draft ? "Publish" : "Draft"}
                          >
                            {p.is_draft ? "Pub" : "Dft"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="border border-gray-100 rounded-lg p-8 text-center text-sm text-gray-400 bg-white shadow-sm">
                No orders found.
              </div>
            ) : (
              orders.map((o: any) => (
                <div key={o.id} className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-text-main text-sm">{o.order_number}</p>
                    {statusBadge(o.payment_status)}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Total: ${Number(o.total_price).toFixed(2)}</p>
                  {o.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-2 mt-2">
                      <span>Item #{item.product_id} x{item.quantity}</span>
                      {statusBadge(item.order_status)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "currencies" && (
          <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
            {currencies.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">No currencies found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Symbol</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Exchange Rate</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-main">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currencies.map((c: any) => (
                    <tr key={c.id}>
                      <td className="py-3 px-4 font-semibold text-text-main">{c.code}</td>
                      <td className="py-3 px-4 text-gray-600">{c.name}</td>
                      <td className="py-3 px-4 text-gray-600">{c.symbol}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          step="0.000001"
                          defaultValue={c.exchange_rate}
                          id={`rate-${c.id}`}
                          className="w-24 h-7 px-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                        />
                      </td>
                      <td className="py-3 px-4">{c.status ? "Active" : "Inactive"}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(`rate-${c.id}`) as HTMLInputElement;
                            const rate = parseFloat(input?.value || "0");
                            if (!rate) { toast.error("Invalid rate"); return; }
                            handleUpdateCurrency(c.id, rate, true);
                          }}
                          className="text-xs bg-primary/10 text-primary font-semibold px-3 h-7 rounded-md hover:bg-primary/20 transition-colors cursor-pointer outline-none"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
