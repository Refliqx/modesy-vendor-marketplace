"use server";

import { createClient } from "@/lib/supabase/server";

export async function addToCartAction(productId: number, quantity: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    // 1. Fetch available stock
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock, is_draft, status")
      .eq("id", productId)
      .maybeSingle();

    if (productError || !product) {
      return { error: productError?.message || "Product not found" };
    }

    if (product.is_draft || !product.status) {
      return { error: "This product is currently not available for purchase." };
    }

    // 2. Check if item already exists in cart
    const { data: existing, error: selectError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (selectError) return { error: selectError.message };

    const newQuantity = existing ? existing.quantity + quantity : quantity;

    // 3. Validate stock
    if (newQuantity > product.stock) {
      return { error: `Only ${product.stock} units of this item are available in stock.` };
    }

    if (existing) {
      // Update quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) return { error: updateError.message };
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: newQuantity,
        });

      if (insertError) return { error: insertError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to add item to cart" };
  }
}

export async function updateCartQtyAction(itemId: number, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    // 1. Verify item ownership and get product stock
    const { data: item, error: selectError } = await supabase
      .from("cart_items")
      .select(`
        id,
        user_id,
        product_id,
        products(stock)
      `)
      .eq("id", itemId)
      .maybeSingle();

    if (selectError || !item) {
      return { error: selectError?.message || "Cart item not found" };
    }

    if (item.user_id !== user.id) {
      return { error: "Forbidden" };
    }

    const productStock = (item.products as any)?.stock ?? 0;

    // 2. Validate stock bounds
    if (quantity > productStock) {
      return { error: `Only ${productStock} units of this item are available in stock.` };
    }

    if (quantity <= 0) {
      return { error: "Quantity must be at least 1." };
    }

    // 3. Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    if (updateError) return { error: updateError.message };

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update quantity" };
  }
}

export async function removeFromCartAction(itemId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  try {
    // Verify item ownership before delete
    const { data: item, error: selectError } = await supabase
      .from("cart_items")
      .select("user_id")
      .eq("id", itemId)
      .maybeSingle();

    if (selectError || !item) {
      return { error: selectError?.message || "Cart item not found" };
    }

    if (item.user_id !== user.id) {
      return { error: "Forbidden" };
    }

    // Delete item
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) return { error: deleteError.message };

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to remove item" };
  }
}
