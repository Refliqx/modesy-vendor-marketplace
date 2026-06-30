import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

function getLangId(locale: string): number {
  return locale === "ar" ? 2 : 1;
}

export interface WishlistProduct {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
  product_images?: {
    image_url: string;
    is_main: boolean | null;
    row_order: number | null;
  }[];
  vendors?:
    | { shop_name: string; shop_slug: string }
    | { shop_name: string; shop_slug: string }[]
    | null;
  product_translations:
    | { title: string; short_description: string | null }[]
    | { title: string; short_description: string | null }
    | null;
}

export async function fetchWishlistProducts(
  supabase: SupabaseClient<Database>,
  userId: string,
  locale: string
): Promise<WishlistProduct[]> {
  const activeLangId = getLangId(locale);

  const { data: wishlistItems } = await (supabase
    .from("wishlists")
    .select(
      `id,
       product_id,
       products!inner (
         id, slug, price, discount_percent, category_id,
         product_translations!inner(title, short_description),
         product_images(image_url, is_main, row_order),
         vendors(shop_name, shop_slug)
       )`
    )
    .eq("user_id", userId)
    .eq("products.product_translations.language_id", activeLangId) as any);

  return (wishlistItems || []).map((item: any) => {
    const prod = item.products;
    return {
      id: prod.id,
      slug: prod.slug,
      price: prod.price,
      discount_percent: prod.discount_percent,
      category_id: prod.category_id,
      product_images: prod.product_images,
      vendors: prod.vendors,
      product_translations: prod.product_translations,
    };
  });
}

export async function fetchWishlistProductsByIds(
  supabase: SupabaseClient<Database>,
  ids: number[],
  locale: string
): Promise<WishlistProduct[]> {
  if (ids.length === 0) return [];

  const activeLangId = getLangId(locale);

  const { data, error } = await (supabase
    .from("products")
    .select(
      `id, slug, price, discount_percent, category_id,
       product_translations!inner(title, short_description),
       product_images(image_url, is_main, row_order),
       vendors(shop_name, shop_slug)`
    )
    .in("id", ids)
    .eq("product_translations.language_id", activeLangId) as any);

  if (error) throw error;
  return (data || []) as WishlistProduct[];
}
