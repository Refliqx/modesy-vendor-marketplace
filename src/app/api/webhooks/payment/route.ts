import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const orderNumber = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const transactionStatus = body.transaction_status;
    const midtransSignature = body.signature_key;

    // Verify signature
    const textToHash = orderNumber + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
    const calculatedSignature = crypto
      .createHash("sha512")
      .update(textToHash)
      .digest("hex");

    if (calculatedSignature !== midtransSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let newPaymentStatus = "pending";

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      newPaymentStatus = "paid";
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      newPaymentStatus = "failed";
    }

    // Update payment_status on orders
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: newPaymentStatus })
      .eq("order_number", orderNumber);

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    // If paid, handle stock, cart, order_items status and history
    if (newPaymentStatus === "paid") {
      const { data: order } = await supabase
        .from("orders")
        .select("id, user_id")
        .eq("order_number", orderNumber)
        .single();

      if (order) {
        const { data: items } = await supabase
          .from("order_items")
          .select("id, product_id, quantity, products!inner(type, stock)")
          .eq("order_id", order.id) as any;

        if (items) {
          const productIds: number[] = [];

          for (const item of items) {
            productIds.push(item.product_id);

            const isDigital = item.products?.type === "digital";
            const newOrderStatus = isDigital ? "delivered" : "paid";

            await supabase
              .from("order_status_history")
              .insert({
                order_item_id: item.id,
                from_status: "pending",
                to_status: newOrderStatus,
                changed_by: null,
                note: isDigital ? "Auto-delivered (digital product)" : null,
              });

            await supabase
              .from("order_items")
              .update({ order_status: newOrderStatus })
              .eq("id", item.id);

            // Decrement stock after payment confirmed
            const newStock = Math.max(0, (item.products?.stock || 0) - item.quantity);
            await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product_id);
          }

          // Clear cart items for products in this paid order
          if (productIds.length > 0) {
            await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", order.user_id)
              .in("product_id", productIds);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} updated to [${newPaymentStatus}]`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
