import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryListingPage } from "@/components/features/products/CategoryListingPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

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
      product_translations!inner(title, short_description),
      product_images(image_url, is_main, row_order),
      vendors(shop_name, shop_slug)
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

  return (
    <CategoryListingPage
      slug="products"
      locale={locale}
      categoryName="Products"
      products={productsList || []}
      categories={rootCategories}
      parentCategory={null}
    />
  );
}
