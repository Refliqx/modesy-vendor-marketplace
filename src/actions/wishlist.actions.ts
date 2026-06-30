"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleWishlist(productId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  // Check if item exists in wishlist
  const { data: existing, error: fetchError } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (existing) {
    // Remove from wishlist
    const { error: deleteError } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (deleteError) {
      return { error: deleteError.message };
    }
    return { success: true, wishlisted: false };
  } else {
    // Add to wishlist
    const { error: insertError } = await supabase
      .from("wishlists")
      .insert({
        user_id: user.id,
        product_id: productId,
      });

    if (insertError) {
      return { error: insertError.message };
    }
    return { success: true, wishlisted: true };
  }
}

export async function getWishlistStatus(productId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { wishlisted: false };
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (error || !data) {
    return { wishlisted: false };
  }

  return { wishlisted: true };
}
