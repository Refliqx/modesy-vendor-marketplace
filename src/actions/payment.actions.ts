"use server";

import { createClient } from "@/lib/supabase/server";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";
const NEXT_PUBLIC_MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

// Midtrans API URL (sandbox)
const MIDTRANS_API_URL = "https://app.sandbox.midtrans.com/snap/v1";
const MIDTRANS_API_BASE = "https://api.sandbox.midtrans.com/v2";

function encodeBasicAuth(serverKey: string) {
  return Buffer.from(serverKey + ":").toString("base64");
}

export async function createSnapTokenAction(shippingAddress?: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  // Get user's cart items and calculate totals
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`
      id, quantity, product_id,
      products!inner(id, vendor_id, price, discount_percent, stock, slug, product_translations!inner(title))
    `)
    .eq("user_id", user.id) as any;

  if (!cartItems || cartItems.length === 0) {
    return { error: "Cart is empty" };
  }

  // Validate stock
  for (const item of cartItems) {
    if (item.quantity > item.products.stock) {
      return { error: `Insufficient stock for "${item.products.product_translations[0]?.title}"` };
    }
  }

  // Calculate totals
  let grossAmount = 0;
  const itemDetails: any[] = [];

  for (const item of cartItems) {
    const prod = item.products;
    const unitPrice = prod.discount_percent
      ? prod.price - (prod.price * prod.discount_percent) / 100
      : prod.price;
    const total = unitPrice * item.quantity;
    grossAmount += total;

    itemDetails.push({
      id: `PROD-${prod.id}`,
      price: Math.round(Number(unitPrice)),
      quantity: item.quantity,
      name: prod.product_translations[0]?.title?.substring(0, 50) || "Product",
    });
  }

  const uniqueVendorCount = new Set(cartItems.map((i: any) => i.products.vendor_id)).size;
  const shippingCost = uniqueVendorCount * 10;
  grossAmount += shippingCost;

  if (shippingCost > 0) {
    itemDetails.push({
      id: "SHIPPING",
      price: Math.round(shippingCost),
      quantity: 1,
      name: "Shipping Cost",
    });
  }

  const orderNumber =
    "ORD-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const transactionDetails = {
    transaction_details: {
      order_id: orderNumber,
      gross_amount: Math.round(grossAmount),
    },
    item_details: itemDetails,
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: user.user_metadata?.full_name?.split(" ")[0] || "Customer",
      last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
      email: user.email || "",
    },
  };

  try {
    const response = await fetch(`${MIDTRANS_API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodeBasicAuth(MIDTRANS_SERVER_KEY)}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(transactionDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error_messages?.[0] || "Failed to create payment token" };
    }

    // Draft order in DB
    const subtotal = itemDetails
      .filter((d: any) => d.id !== "SHIPPING")
      .reduce((sum: number, d: any) => sum + d.price * d.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_price: Math.round(grossAmount),
        total_shipping_cost: Math.round(shippingCost),
        payment_status: "pending",
        payment_method: "midtrans",
        shipping_address: shippingAddress ? JSON.stringify(shippingAddress) : "{}",
        snap_token: data.token,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return { error: orderError?.message || "Failed to create order" };
    }

    // Create order items
    for (const item of cartItems) {
      const prod = item.products;
      const unitPrice = prod.discount_percent
        ? prod.price - (prod.price * prod.discount_percent) / 100
        : prod.price;

      const commissionRate = 10;
      const itemTotal = unitPrice * item.quantity;
      const commissionAmount = itemTotal * (commissionRate / 100);

      const { data: orderItem } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          vendor_id: prod.vendor_id,
          product_id: prod.id,
          price: unitPrice,
          quantity: item.quantity,
          shipping_cost: 10,
          commission_amount: commissionAmount,
          vendor_earning: itemTotal - commissionAmount,
          order_status: "pending",
        })
        .select("id")
        .single();

      if (orderItem) {
        await supabase.from("order_status_history").insert({
          order_item_id: orderItem.id,
          from_status: null,
          to_status: "pending",
          changed_by: user.id,
        });
      }
    }

    return {
      success: true,
      snapToken: data.token,
      orderNumber,
      clientKey: NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || MIDTRANS_CLIENT_KEY,
    };
  } catch (err: any) {
    return { error: err.message || "Failed to process payment" };
  }
}

export async function checkPaymentStatusAction(orderNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data: order } = await supabase
    .from("orders")
    .select("payment_status")
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .maybeSingle();

  return { status: order?.payment_status || "unknown" };
}
