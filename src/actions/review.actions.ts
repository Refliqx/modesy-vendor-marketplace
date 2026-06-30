"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional().nullable(),
});

export async function submitReview(formData: {
  productId: number;
  rating: number;
  review?: string | null;
}) {
  const validation = reviewSchema.safeParse(formData);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid review data" };
  }

  const { productId, rating, review } = validation.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to write a review" };
  }

  // Check eligibility: user must have bought the product, payment must be 'paid', and order must be 'delivered'
  const { data: eligible, error: eligibilityError } = await supabase
    .from("order_items")
    .select("id, orders!inner(user_id, payment_status)")
    .eq("product_id", productId)
    .eq("orders.user_id", user.id)
    .eq("orders.payment_status", "paid")
    .eq("order_status", "delivered")
    .limit(1);

  if (eligibilityError) {
    return { error: eligibilityError.message };
  }

  if (!eligible || eligible.length === 0) {
    return { error: "Only verified buyers of this product can leave a review." };
  }

  // Check if they already reviewed it (enforce unique user_id + product_id review constraint)
  const { data: existingReview, error: reviewCheckError } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (reviewCheckError) {
    return { error: reviewCheckError.message };
  }

  if (existingReview) {
    // Update existing review
    const { error: updateError } = await supabase
      .from("product_reviews")
      .update({
        rating,
        review: review || null,
        created_at: new Date().toISOString(),
      })
      .eq("id", existingReview.id);

    if (updateError) {
      return { error: updateError.message };
    }

    return { success: true, updated: true };
  } else {
    // Insert new review
    const { error: insertError } = await supabase
      .from("product_reviews")
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        review: review || null,
      });

    if (insertError) {
      return { error: insertError.message };
    }

    return { success: true, updated: false };
  }
}

export async function checkReviewEligibility(productId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { eligible: false, reviewed: false };
  }

  // Check if they bought it and it's been delivered
  const { data: eligible, error } = await supabase
    .from("order_items")
    .select("id, orders!inner(user_id, payment_status)")
    .eq("product_id", productId)
    .eq("orders.user_id", user.id)
    .eq("orders.payment_status", "paid")
    .eq("order_status", "delivered")
    .limit(1);

  if (error || !eligible || eligible.length === 0) {
    return { eligible: false, reviewed: false };
  }

  // Check if they reviewed it
  const { data: review } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  return { eligible: true, reviewed: !!review };
}
