import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryListingPage } from "@/components/features/products/CategoryListingPage";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products available on Modesy marketplace.",
};

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const supabase = await createClient();

  // Get current language details
  const { data: langData } = await (supabase
    .from("languages")
    .select("id")
    .eq("code", locale)
    .maybeSingle() as any);

  const activeLangId = langData?.id || 1;

  // Fetch all active products
  const { data: allProducts } = await (supabase
    .from("products")
    .select(`
      id,
      slug,
      price,
      discount_percent,
      category_id,
      brand_id,
      color,
      size,
      material,
      is_featured,
      created_at,
      product_translations!inner(title, short_description),
      product_images(image_url, is_main, row_order),
      vendors(shop_name, shop_slug),
      brands(name, slug)
    `)
    .eq("status", true)
    .eq("is_draft", false)
    .eq("product_translations.language_id", activeLangId) as any);

  // Fetch all categories for sidebar hierarchy & naming
  const { data: allCategories } = await (supabase
    .from("categories")
    .select("id, slug, parent_id, category_translations!inner(name)")
    .eq("status", true)
    .eq("category_translations.language_id", activeLangId) as any);

  // Count helper
  const countMap: Record<number, number> = {};
  const productsList = allProducts || [];
  for (const p of productsList) {
    if (p.category_id != null) {
      countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    }
  }

  const childrenMap = new Map<number, number[]>();
  for (const cat of (allCategories || [])) {
    if (cat.parent_id != null) {
      const list = childrenMap.get(cat.parent_id) || [];
      list.push(cat.id);
      childrenMap.set(cat.parent_id, list);
    }
  }

  const memoCounts: Record<number, number> = {};
  function getRecursiveCount(catId: number): number {
    if (catId in memoCounts) return memoCounts[catId];
    let sum = countMap[catId] || 0;
    const children = childrenMap.get(catId) || [];
    for (const childId of children) {
      sum += getRecursiveCount(childId);
    }
    memoCounts[catId] = sum;
    return sum;
  }

  // Categories to show: LEVEL 1 ONLY (parent_id is null)
  const rootCategories = (allCategories || [])
    .filter((cat: any) => cat.parent_id === null)
    .map((cat: any) => {
      const name = cat.category_translations[0]?.name || cat.slug;
      return {
        id: cat.id,
        slug: cat.slug,
        label: name,
        count: getRecursiveCount(cat.id),
      };
    });

  // Fetch brands with product counts
  const { data: brandsData } = await (supabase
    .from("brands")
    .select("id, name, slug")
    .eq("status", true)
    .order("name", { ascending: true }) as any);

  const brandCountMap: Record<number, number> = {};
  for (const p of productsList) {
    if (p.brand_id != null) {
      brandCountMap[p.brand_id] = (brandCountMap[p.brand_id] || 0) + 1;
    }
  }

  const brands = (brandsData || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    count: brandCountMap[b.id] || 0,
  }));

  // Fetch colors, sizes, materials with counts
  const colorCountMap: Record<string, number> = {};
  const sizeCountMap: Record<string, number> = {};
  const materialCountMap: Record<string, number> = {};
  for (const p of productsList) {
    if (p.color) colorCountMap[p.color] = (colorCountMap[p.color] || 0) + 1;
    if (p.size) sizeCountMap[p.size] = (sizeCountMap[p.size] || 0) + 1;
    if (p.material) materialCountMap[p.material] = (materialCountMap[p.material] || 0) + 1;
  }

  const { data: colorsData } = await (supabase
    .from("product_colors")
    .select("name, hex_code")
    .eq("status", true)
    .order("name") as any);

  const { data: sizesData } = await (supabase
    .from("product_sizes")
    .select("name")
    .eq("status", true)
    .order("name") as any);

  const { data: materialsData } = await (supabase
    .from("product_materials")
    .select("name")
    .eq("status", true)
    .order("name") as any);

  const colors = (colorsData || []).map((c: any) => ({
    name: c.name,
    hex_code: c.hex_code,
    count: colorCountMap[c.name] || 0,
  }));

  const sizes = (sizesData || []).map((s: any) => ({
    name: s.name,
    count: sizeCountMap[s.name] || 0,
  }));

  const materials = (materialsData || []).map((m: any) => ({
    name: m.name,
    count: materialCountMap[m.name] || 0,
  }));

  const maxPrice = productsList.reduce((max: number, p: any) => Math.max(max, Number(p.price)), 0);

  return (
    <CategoryListingPage
      slug="products"
      locale={locale}
      categoryName="Products"
      products={productsList || []}
      categories={rootCategories}
      parentCategory={null}
      brands={brands}
      colors={colors}
      sizes={sizes}
      materials={materials}
      maxPrice={maxPrice}
    />
  );
}
