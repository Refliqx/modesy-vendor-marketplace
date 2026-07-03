"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWalletData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [vendorRes, ordersRes] = await Promise.all([
    supabase
      .from("vendors")
      .select("id, shop_name, balance, is_verified")
      .eq("user_id", user.id)
      .maybeSingle() as any,
    supabase
      .from("orders")
      .select(`
        id, order_number, total_price, payment_status, payment_method, created_at,
        order_items(id, product_id, price, quantity)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50) as any,
  ]);

  const vendor = vendorRes?.data || null;
  const orders = ordersRes?.data || [];

  let deposits: any[] = [];
  if (vendor) {
    const { data: earnings } = await (supabase
      .from("order_items")
      .select(`
        id, price, quantity, vendor_earning, commission_amount, order_status, created_at,
        orders!inner(order_number, payment_status),
        products!inner(product_translations!inner(title))
      `)
      .eq("vendor_id", vendor.id)
      .order("created_at", { ascending: false })
      .limit(50) as any);
    deposits = earnings || [];
  }

  return {
    balance: vendor?.balance ?? 0,
    vendor,
    deposits,
    expenses: orders,
  };
}
