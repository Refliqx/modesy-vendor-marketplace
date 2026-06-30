"use server";

import { createClient } from "@/lib/supabase/server";
import { validateCoupon } from "@/lib/dummy/coupons";

export async function draftOrderAction(
  paymentMethod: string,
  shippingAddress: any,
  couponCode: string | null = null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    // 1. Fetch active cart items with products and vendors
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        products!inner (
          id,
          price,
          discount_percent,
          stock,
          vendor_id,
          product_translations!inner(title),
          vendors!inner(id, shop_name, shop_slug, custom_commission_rate)
        )
      `)
      .eq("user_id", user.id);

    if (cartError) {
      return { error: cartError.message };
    }

    if (!cartItems || cartItems.length === 0) {
      return { error: "Your shopping cart is empty" };
    }

    // 2. Validate stock for all items
    for (const item of cartItems) {
      const prod = item.products as any;
      if (item.quantity > prod.stock) {
        const title = prod.product_translations[0]?.title || "Product";
        return { error: `Only ${prod.stock} units of "${title}" are available in stock.` };
      }
    }

    // 3. Compute costs and coupon discounts
    let subtotal = 0;
    for (const item of cartItems) {
      const prod = item.products as any;
      const unitPrice = prod.discount_percent !== null
        ? prod.price - (prod.price * prod.discount_percent) / 100
        : prod.price;
      subtotal += unitPrice * item.quantity;
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = validateCoupon(couponCode);
      if (coupon) {
        discountAmount = (subtotal * coupon.discountPercent) / 100;
      }
    }

    const uniqueVendors = Array.from(new Set(cartItems.map((item) => (item.products as any).vendor_id)));
    const shippingCost = uniqueVendors.length * 10; // flat rate per vendor
    const totalPrice = subtotal - discountAmount + shippingCost;

    // 4. Generate order number
    const orderNumber =
      "ORD-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    // 5. Insert order
    const { data: order, error: orderInsertError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_price: totalPrice,
        total_shipping_cost: shippingCost,
        payment_status: "pending",
        payment_method: paymentMethod,
        shipping_address: JSON.stringify(shippingAddress),
      })
      .select("id")
      .single();

    if (orderInsertError || !order) {
      return { error: orderInsertError?.message || "Failed to create order" };
    }

    // 6. Insert order items & update product stocks
    for (const item of cartItems) {
      const prod = item.products as any;
      const unitPrice = prod.discount_percent !== null
        ? prod.price - (prod.price * prod.discount_percent) / 100
        : prod.price;

      const vendor = prod.vendors;
      const commissionRate =
        vendor?.custom_commission_rate !== null
          ? Number(vendor.custom_commission_rate)
          : 10.0; // Default platform commission: 10%

      const itemTotal = unitPrice * item.quantity;
      const commissionAmount = itemTotal * (commissionRate / 100);
      const vendorEarning = itemTotal - commissionAmount;

      const { data: insertedItem, error: itemInsertError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          vendor_id: prod.vendor_id,
          product_id: prod.id,
          price: unitPrice,
          quantity: item.quantity,
          shipping_cost: 10.0,
          commission_amount: commissionAmount,
          vendor_earning: vendorEarning,
          order_status: "pending",
        })
        .select("id")
        .single();

      if (itemInsertError || !insertedItem) {
        return { error: itemInsertError?.message || "Failed to create order item" };
      }

      // Log initial order_status_history
      await supabase
        .from("order_status_history")
        .insert({
          order_item_id: insertedItem.id,
          from_status: null,
          to_status: "pending",
          changed_by: user.id,
        });

      // Decrement stock
      const { error: stockUpdateError } = await supabase
        .from("products")
        .update({ stock: prod.stock - item.quantity })
        .eq("id", prod.id);

      if (stockUpdateError) {
        return { error: `Failed to update product stock: ${stockUpdateError.message}` };
      }
    }

    // 7. Clear cart items
    const { error: clearCartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (clearCartError) {
      return { error: `Failed to clear cart: ${clearCartError.message}` };
    }

    return { success: true, orderNumber };
  } catch (err: any) {
    return { error: err.message || "Failed to draft order" };
  }
}
