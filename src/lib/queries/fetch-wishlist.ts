import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

function loadGuestWishlistIds(): Set<number> {
  const stored =
    typeof window !== "undefined"
      ? localStorage.getItem("modesy_guest_wishlist")
      : null;
  if (!stored) return new Set();
  try {
    const ids = JSON.parse(stored);
    return Array.isArray(ids) ? new Set(ids) : new Set();
  } catch {
    return new Set();
  }
}

export async function fetchWishlistAuthenticated(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<number[]> {
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data || []).map((row: any) => row.product_id as number);
}

export function fetchWishlistGuest(): number[] {
  const set = loadGuestWishlistIds();
  return Array.from(set);
}
