import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/features/breadcrumb/Breadcrumb";
import { ProductImageSlider } from "@/components/features/products/ProductImageSlider";
import { ProductInfoPanel } from "@/components/features/products/ProductInfoPanel";
import { ProductTabs } from "@/components/features/products/ProductTabs";
import { CategoryListingPage } from "@/components/features/products/CategoryListingPage";
import { ProductGridSection } from "@/components/home/ProductGridSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function SlugPage({ params }: PageProps) {
  const { locale, slug } = await params;

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

  // 1. Try to fetch product by slug
  const { data: product } = await (supabase
    .from("products")
    .select(`
      id,
      slug,
      price,
      discount_percent,
      category_id,
      stock,
      type,
      weight,
      vendor_id,
      product_translations!inner(title, description, short_description),
      product_images(id, image_url, is_main, row_order),
      vendors(shop_name, shop_slug, shop_logo),
      product_options(
        id,
        name,
        product_id,
        product_option_values(id, option_id, value, price_modifier, stock)
      )
    `)
    .eq("slug", slug)
    .eq("status", true)
    .eq("is_draft", false)
    .eq("product_translations.language_id", activeLangId)
    .maybeSingle() as any);

  if (product) {
    // Parallel fetch reviews and related products
    const [reviewsResponse, relatedProductsResponse, categoryResponse] = await Promise.all([
      supabase
        .from("product_reviews")
        .select("id, rating, review, created_at, profiles(full_name, avatar_url)")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false }) as any,
      supabase
        .from("products")
        .select(`
          id, slug, price, discount_percent, category_id,
          product_translations!inner(title, short_description),
          product_images(image_url, is_main, row_order),
          vendors(shop_name, shop_slug)
        `)
        .eq("category_id", product.category_id || 0)
        .neq("id", product.id)
        .eq("status", true)
        .eq("is_draft", false)
        .eq("product_translations.language_id", activeLangId)
        .limit(5) as any,
      supabase
        .from("categories")
        .select("slug, category_translations!inner(name)")
        .eq("id", product.category_id || 0)
        .eq("category_translations.language_id", activeLangId)
        .maybeSingle() as any,
    ]);

    const reviews = reviewsResponse.data || [];
    const relatedProducts = relatedProductsResponse.data || [];
    const categorySlug = categoryResponse.data?.slug;
    const categoryName = categoryResponse.data?.category_translations[0]?.name || "Products";
    const ratingCount = reviews.length;
    const ratingAverage =
      ratingCount > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / ratingCount : 0;

    const productTitle = product.product_translations[0]?.title || product.slug;

    return (
      <div className="flex flex-col flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: `/${locale}` },
            {
              label: categoryName,
              href: categorySlug ? `/${locale}/products/${categorySlug}` : `/${locale}/products`,
            },
            { label: productTitle },
          ]}
        />
        <div className="max-w-screen-xl mx-auto px-6 py-8 flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <ProductImageSlider
                images={product.product_images || []}
                title={productTitle}
              />
            </div>
            <div className="md:col-span-5">
              <ProductInfoPanel
                product={product as any}
                reviewsCount={ratingCount}
                ratingAverage={ratingAverage}
              />
            </div>
          </div>
          <ProductTabs product={product as any} reviews={reviews} />
          
          {/* Related Products Carousel/Grid Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 border-t border-gray-100 pt-8">
              <ProductGridSection
                title="You May Also Like"
                products={relatedProducts}
                categoryNameMap={{ [product.category_id || 0]: categoryName }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Try to fetch category by slug if not a product
  const { data: category } = await (supabase
    .from("categories")
    .select("id, slug")
    .eq("slug", slug)
    .eq("status", true)
    .maybeSingle() as any);

  if (category) {
    redirect(`/${locale}/products/${slug}`);
  }

  notFound();
}
