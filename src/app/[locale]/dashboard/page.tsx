"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  Package, ShoppingBag, DollarSign, Clock, Eye, EyeOff,
  ChevronDown, ChevronUp, Truck, Search, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { useCartStore } from "@/stores/useCartStore";
import { getVendorStats, getVendorProducts, toggleProductStatusAction } from "@/actions/vendor.actions";
import { getOrderItemsForVendor, updateOrderItemStatus } from "@/actions/order-status.actions";
import { ProductForm } from "@/components/features/products/ProductForm";
import { toast } from "sonner";

type Tab = "overview" | "products" | "orders" | "add";

export default function VendorDashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const user = useCartStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}`);
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [s, p, o] = await Promise.all([
      getVendorStats(),
      getVendorProducts(),
      getOrderItemsForVendor(),
    ]);
    if (!s) { router.push(`/${locale}`); return; }
    setStats(s);
    setProducts(p);
    setOrders(o.items);
    setLoading(false);
  };

  const handleToggleProduct = async (productId: number, field: "status" | "is_draft", current: boolean) => {
    const res = await toggleProductStatusAction(productId, field, !current);
    if (res.error) { toast.error(res.error); return; }
    toast.success("Product updated");
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, [field]: !current } : p
    ));
  };

  const handleUpdateStatus = async (itemId: number, newStatus: "processing" | "shipped" | "delivered") => {
    const res = await updateOrderItemStatus({ orderItemId: itemId, newStatus });
    if (res.error) { toast.error(res.error); return; }
    toast.success(`Status updated to ${newStatus}`);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Dashboard" }]} />
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "products", label: `Products (${products.length})` },
    { id: "orders", label: `Orders (${orders.length})` },
    { id: "add", label: editProduct ? "Edit Product" : "Add Product" },
  ];

  return (
    <div className="flex flex-col flex-1 select-none">
      <Breadcrumb items={[{ label: "Home", href: `/${locale}` }, { label: "Vendor Dashboard" }]} />
      <div className="max-w-screen-xl mx-auto px-6 py-8 w-full">
        <h1 className="text-2xl font-bold text-text-main mb-2">Vendor Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome, {stats?.shop_name}</p>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors cursor-pointer outline-none",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Products", value: stats.productCount, icon: Package, color: "text-blue-600 bg-blue-50" },
              { label: "Orders", value: stats.orderCount, icon: ShoppingBag, color: "text-green-600 bg-green-50" },
              { label: "Pending", value: stats.pendingOrderCount, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
              { label: "Balance", value: `$${Number(stats.balance || 0).toFixed(2)}`, icon: DollarSign, color: "text-primary bg-primary/5" },
            ].map((card, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", card.color)}>
                  <card.icon size={20} />
                </div>
                <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                <p className="text-xl font-bold text-text-main">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => { setEditProduct(null); setActiveTab("add"); }}
                className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>
            <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
              {products.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No products yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-main">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-text-main">{p.product_translations?.[0]?.title || p.slug}</p>
                            <p className="text-[11px] text-gray-400">MD-{p.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-main font-medium">${Number(p.price).toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-600">{p.stock}</td>
                        <td className="py-3 px-4">{statusBadge(p.status ? "active" : "inactive")}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => { setEditProduct(p); setActiveTab("add"); }}
                              className="w-7 h-7 rounded flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Package size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleProduct(p.id, "status", p.status)}
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
                              onClick={() => handleToggleProduct(p.id, "is_draft", p.is_draft)}
                              className={cn(
                                "w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer",
                                p.is_draft ? "bg-yellow-50 text-yellow-600" : "bg-blue-50 text-blue-600"
                              )}
                              title={p.is_draft ? "Publish" : "Draft"}
                            >
                              {p.is_draft ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <ProductForm
            initial={editProduct}
            onSaved={() => { setEditProduct(null); loadData(); setActiveTab("products"); }}
            onCancel={() => { setEditProduct(null); setActiveTab("products"); }}
          />
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="border border-gray-100 rounded-lg p-8 text-center text-sm text-gray-400 bg-white shadow-sm">
                No orders yet.
              </div>
            ) : (
              orders.map((order: any) => {
                const title = order.products?.product_translations?.[0]?.title || "Product";
                return (
                  <div key={order.id} className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-text-main">
                          {title} x{order.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          Order: {order.orders?.order_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge(order.order_status)}
                        {order.tracking_number && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Truck size={12} /> {order.tracking_number}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Total: ${(Number(order.price) * order.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2">
                        {order.order_status === "paid" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, "processing")}
                            className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 h-7 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer outline-none"
                          >
                            Process
                          </button>
                        )}
                        {order.order_status === "processing" && (
                          <>
                            <input
                              type="text"
                              placeholder="Tracking #"
                              className="w-28 h-7 px-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                              id={`tracking-${order.id}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                const tracking = input?.value || null;
                                const note = tracking ? `Tracking: ${tracking}` : undefined;
                                updateOrderItemStatus({
                                  orderItemId: order.id,
                                  newStatus: "shipped",
                                  trackingNumber: tracking || undefined
                                }).then(r => {
                                  if (r.error) toast.error(r.error);
                                  else { toast.success("Shipped!"); loadData(); }
                                });
                              }}
                              className="text-xs bg-purple-50 text-purple-600 font-semibold px-3 h-7 rounded-md hover:bg-purple-100 transition-colors cursor-pointer outline-none"
                            >
                              Ship
                            </button>
                          </>
                        )}
                        {order.order_status === "shipped" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, "delivered")}
                            className="text-xs bg-green-50 text-green-600 font-semibold px-3 h-7 rounded-md hover:bg-green-100 transition-colors cursor-pointer outline-none"
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
