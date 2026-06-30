import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryListingPage } from "@/components/features/products/CategoryListingPage";

interface PageProps {
  params: Promise<{ locale: string; categorySlug: string }>;
}

export default async function CategoryProductsPage({ params }: PageProps) {
  const { locale, categorySlug } = await params;

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

  // Try to fetch category by slug
  const { data: category } = await (supabase
    .from("categories")
    .select("id, slug, parent_id, category_translations!inner(name)")
    .eq("slug", categorySlug)
    .eq("status", true)
    .eq("category_translations.language_id", activeLangId)
    .maybeSingle() as any);

  if (!category) {
    notFound();
  }

  const categoryName = category.category_translations[0]?.name || category.slug;

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

  // Fetch all categories for hierarchy
  const { data: allCategories } = await (supabase
    .from("categories")
    .select("id, slug, parent_id, category_translations!inner(name)")
    .eq("status", true)
    .eq("category_translations.language_id", activeLangId) as any);

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

  // Determine allowed category IDs under the current category (current category + descendants)
  const allowedCategoryIds = new Set<number>();
  function collectAllowedCategoryIds(catId: number) {
    allowedCategoryIds.add(catId);
    const children = childrenMap.get(catId) || [];
    for (const childId of children) {
      collectAllowedCategoryIds(childId);
    }
  }
  collectAllowedCategoryIds(category.id);

  // Filter products belonging to current category & descendants
  const filteredProducts = productsList.filter(
    (p: any) => p.category_id != null && allowedCategoryIds.has(p.category_id)
  );

  // Map categories for hierarchy lookup
  const catMap = new Map<number, { id: number; slug: string; name: string; parent_id: number | null }>();
  for (const cat of (allCategories || [])) {
    const name = cat.category_translations[0]?.name || cat.slug;
    catMap.set(cat.id, { id: cat.id, slug: cat.slug, name, parent_id: cat.parent_id });
  }

  const currentCatId = category.id;
  const currentNode = catMap.get(currentCatId)!;
  const parentNode = currentNode.parent_id != null ? catMap.get(currentNode.parent_id) : null;
  const grandparentNode = parentNode && parentNode.parent_id != null ? catMap.get(parentNode.parent_id) : null;

  let sidebarCategoriesRaw: any[] = [];
  let parentCategoryLink: { label: string; slug: string } | null = null;

  if (parentNode === null || parentNode === undefined) {
    // Current is Level 1 (Root)
    parentCategoryLink = { label: "All Products", slug: "products" };
    // Show child categories (Level 2)
    sidebarCategoriesRaw = (allCategories || []).filter((cat: any) => cat.parent_id === currentCatId);
  } else if (grandparentNode === null || grandparentNode === undefined) {
    // Current is Level 2 (Sub)
    parentCategoryLink = { label: parentNode.name, slug: parentNode.slug };
    // Show child categories (Level 3)
    const childCats = (allCategories || []).filter((cat: any) => cat.parent_id === currentCatId);
    if (childCats.length > 0) {
      sidebarCategoriesRaw = childCats;
    } else {
      // Fallback: show siblings
      sidebarCategoriesRaw = (allCategories || []).filter((cat: any) => cat.parent_id === parentNode.id);
    }
  } else {
    // Current is Level 3 (Leaf)
    parentCategoryLink = { label: parentNode.name, slug: parentNode.slug };
    // Show siblings (Level 3 under parentNode)
    sidebarCategoriesRaw = (allCategories || []).filter((cat: any) => cat.parent_id === parentNode.id);
  }

  const sidebarCategories = sidebarCategoriesRaw.map((cat: any) => {
    const name = cat.category_translations[0]?.name || cat.slug;
    return {
      label: name,
      slug: cat.slug,
      count: getRecursiveCount(cat.id),
    };
  });

  return (
    <CategoryListingPage
      slug={categorySlug}
      locale={locale}
      categoryName={categoryName}
      products={filteredProducts}
      categories={sidebarCategories}
      parentCategory={parentCategoryLink}
    />
  );
}
