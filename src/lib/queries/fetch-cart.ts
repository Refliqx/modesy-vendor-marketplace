import type { SupabaseClient } from "@supabase/supabase-js";
import type { NormalizedCartItem } from "@/types/cart";
import type { Database } from "@/types/supabase";

function getLangId(locale: string): number {
  return locale === "ar" ? 2 : 1;
}

function normalizeCartItem(item: any): NormalizedCartItem {
  const p = item.products || {};
  const trans = Array.isArray(p.product_translations)
    ? p.product_translations[0]
    : p.product_translations;
  const vend = Array.isArray(p.vendors)
    ? p.vendors[0]
    : p.vendors;

  return {
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    slug: p.slug || "",
    title: trans?.title || "",
    price: p.price || 0,
    discountPercent: p.discount_percent || null,
    vendorId: p.vendor_id || 0,
    vendorName: vend?.shop_name || "Admin",
    vendorSlug: vend?.shop_slug || "admin",
    shipFromCountry: vend?.ship_from_country || null,
    shipFromState: vend?.ship_from_state || null,
  };
}

export async function fetchCartAuthenticated(
  supabase: SupabaseClient<Database>,
  userId: string,
  locale: string
): Promise<NormalizedCartItem[]> {
  const activeLangId = getLangId(locale);

  const { data, error } = await (supabase.from("cart_items") as any)
    .select(
      `id, quantity, product_id,
       products!inner (
         id, slug, price, discount_percent, vendor_id,
         product_translations!inner(title, short_description),
         vendors (id, shop_name, shop_slug)
       )`
    )
    .eq("user_id", userId)
    .eq("products.product_translations.language_id", activeLangId);

  if (error) {
    console.error("Cart fetch error:", error.message || error);
    return [];
  }

  return (data || []).map(normalizeCartItem);
}

export async function fetchCartGuest(
  supabase: SupabaseClient<Database>,
  locale: string
): Promise<NormalizedCartItem[]> {
  const stored =
    typeof window !== "undefined"
      ? localStorage.getItem("modesy_guest_cart")
      : null;
  if (!stored) return [];

  try {
    const guestItems = JSON.parse(stored);
    if (!Array.isArray(guestItems) || guestItems.length === 0) return [];

    const productIds = guestItems.map((it: any) => it.product_id);
    const activeLangId = getLangId(locale);

    const { data, error } = await (supabase
      .from("products")
      .select(
        `id, slug, price, discount_percent, vendor_id,
         product_translations!inner(title, short_description),
         vendors!inner(id, shop_name, shop_slug)`
      )
      .in("id", productIds)
      .eq("product_translations.language_id", activeLangId) as any);

    if (error) throw error;

    return (data || []).map((p: any) => {
      const guestItem = guestItems.find(
        (it: any) => it.product_id === p.id
      );
      const qty = guestItem ? guestItem.quantity : 1;
      const trans = Array.isArray(p.product_translations)
        ? p.product_translations[0]
        : p.product_translations;
      const vend = Array.isArray(p.vendors)
        ? p.vendors[0]
        : p.vendors;

      return {
        id: p.id,
        productId: p.id,
        quantity: qty,
        slug: p.slug || "",
        title: trans?.title || "",
        price: p.price || 0,
        discountPercent: p.discount_percent || null,
        vendorId: p.vendor_id || 0,
        vendorName: vend?.shop_name || "Admin",
        vendorSlug: vend?.shop_slug || "admin",
        shipFromCountry: (vend as any)?.ship_from_country || null,
        shipFromState: (vend as any)?.ship_from_state || null,
      };
    });
  } catch (e) {
    console.error("Error loading guest cart:", e);
    return [];
  }
}
