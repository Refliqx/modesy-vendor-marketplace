import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const langId = Number(searchParams.get("lang") ?? "1");

  if (q.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const supabase = await createClient();

  const [productsRes, categoriesRes] = await Promise.all([
    (supabase
      .from("product_translations")
      .select("title, product_id, products!inner(slug, price, discount_percent, status, is_draft)")
      .eq("language_id", langId)
      .ilike("title", `%${q}%`)
      .eq("products.status", true)
      .eq("products.is_draft", false)
      .limit(6) as any),
    (supabase
      .from("category_translations")
      .select("name, category_id, categories!inner(slug, status)")
      .eq("language_id", langId)
      .ilike("name", `%${q}%`)
      .eq("categories.status", true)
      .limit(4) as any),
  ]);

  const products = (productsRes.data ?? []).map((row: any) => ({
    id: row.product_id,
    title: row.title,
    slug: row.products?.slug ?? "",
    price: row.products?.price ?? 0,
    discount_percent: row.products?.discount_percent ?? null,
  }));

  const categories = (categoriesRes.data ?? []).map((row: any) => ({
    id: row.category_id,
    name: row.name,
    slug: row.categories?.slug ?? "",
  }));

  return NextResponse.json({ products, categories });
}
