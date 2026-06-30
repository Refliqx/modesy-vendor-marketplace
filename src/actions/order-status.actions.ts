"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateStatusSchema = z.object({
  orderItemId: z.number().int().positive(),
  newStatus: z.enum(["processing", "shipped", "delivered"]),
  trackingNumber: z.string().max(100).optional().nullable(),
});

export async function updateOrderItemStatus(formData: {
  orderItemId: number;
  newStatus: "processing" | "shipped" | "delivered";
  trackingNumber?: string | null;
}) {
  const validation = updateStatusSchema.safeParse(formData);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid data" };
  }

  const { orderItemId, newStatus, trackingNumber } = validation.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  // Verify the user is the vendor who owns this order item OR an admin
  const { data: item } = await supabase
    .from("order_items")
    .select("id, order_status, vendor_id, order_id, orders!inner(user_id, payment_status)")
    .eq("id", orderItemId)
    .single();

  if (!item) return { error: "Order item not found" };

  // Check authorization: must be the vendor who owns this item or admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isVendor = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .eq("id", item.vendor_id)
    .maybeSingle()
    .then(r => !!r.data);

  const isAdmin = profile?.role === "admin";

  if (!isVendor && !isAdmin) {
    return { error: "You are not authorized to update this order item" };
  }

  // If product is digital and status is being moved to 'shipped', skip to 'delivered'
  // Digital products are auto-delivered
  const fromStatus = item.order_status;

  // Validate transition: only allow forward progression
  const validTransitions: Record<string, string[]> = {
    pending: ["processing"],
    processing: ["shipped", "delivered"],
    shipped: ["delivered"],
  };

  const allowed = validTransitions[fromStatus || "pending"];
  if (!allowed || !allowed.includes(newStatus)) {
    return { error: `Cannot transition from "${fromStatus}" to "${newStatus}"` };
  }

  try {
    const updates: any = { order_status: newStatus };
    if (trackingNumber) {
      updates.tracking_number = trackingNumber;
    }

    const { error: updateError } = await supabase
      .from("order_items")
      .update(updates)
      .eq("id", orderItemId);

    if (updateError) throw new Error(updateError.message);

    // Log to order_status_history
    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert({
        order_item_id: orderItemId,
        from_status: fromStatus,
        to_status: newStatus,
        changed_by: user.id,
        note: trackingNumber ? `Tracking: ${trackingNumber}` : null,
      });

    if (historyError) throw new Error(historyError.message);

    return { success: true, fromStatus, toStatus: newStatus };
  } catch (err: any) {
    return { error: err.message || "Failed to update status" };
  }
}

export async function getOrderItemsForVendor() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { items: [] };

  const vendor = await supabase
    .from("vendors")
    .select("id, shop_name")
    .eq("user_id", user.id)
    .maybeSingle()
    .then(r => r.data);

  if (!vendor) return { items: [] };

  const { data } = await supabase
    .from("order_items")
    .select(`
      id, order_id, product_id, price, quantity, shipping_cost, order_status, tracking_number, created_at,
      orders!inner(order_number, user_id, payment_status),
      products!inner(slug, product_translations!inner(title))
    `)
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false })
    .limit(50) as any;

  return { items: data || [] };
}

export async function getOrdersForAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { orders: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { orders: [] };

  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, total_price, total_shipping_cost, payment_status, payment_method, shipping_address, created_at,
      user_id,
      order_items(id, vendor_id, product_id, price, quantity, order_status, tracking_number)
    `)
    .order("created_at", { ascending: false })
    .limit(50) as any;

  return { orders: data || [] };
}
