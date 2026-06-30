import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGridSection } from "@/components/home/ProductGridSection";
import { ProductCarouselSection } from "@/components/home/ProductCarouselSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { DoublePromoBanner, TriplePromoBanner } from "@/components/home/PromoBanners";
import { BrandCarouselSection } from "@/components/home/BrandCarouselSection";
import { BlogCarouselSection } from "@/components/home/BlogCarouselSection";
import { ProductGridSectionSkeleton } from "@/components/home/ProductGridSectionSkeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { HeroCarouselSkeleton } from "@/components/home/HeroCarouselSkeleton";
import { CategoryGridSkeleton } from "@/components/home/CategoryGridSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  openGraph: {
    title: "Modesy — Online Marketplace",
    description: "Discover fashion, home goods, digital products, and more.",
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const supabase = await createClient();

  const [t, categoriesRes] = await Promise.all([
    getTranslations("home"),
    supabase
      .from("categories")
      .select("id, slug, image_path, category_translations!inner(name)")
      .eq("status", true)
      .eq("category_translations.language_id", locale === "ar" ? 2 : 1) as any,
  ]);

  const activeLangId = locale === "ar" ? 2 : 1;
  const { data: categoriesData } = categoriesRes;

  const formattedCategories = (categoriesData || []).map((cat: any) => {
    const translations = cat.category_translations;
    const name = Array.isArray(translations)
      ? translations[0]?.name
      : (translations as any)?.name;
    return {
      id: cat.id,
      slug: cat.slug,
      name: name || cat.slug,
      image_path: cat.image_path,
    };
  });

  const categoryNameMap: Record<number, string> = {};
  for (const cat of formattedCategories) {
    categoryNameMap[cat.id] = cat.name;
  }

  const clothingCategory = formattedCategories.find((c: any) => c.slug === "clothing");
  const jewelryCategory = formattedCategories.find((c: any) => c.slug === "jewelry-accessories");

  const homeCategorySlugs = [
    "clothing",
    "home-living",
    "toys-entertainment",
    "clothing-women-s-clothing",
    "clothing-men-s-clothing",
    "home-living-furniture",
    "jewelry-accessories-necklaces-and-accessories",
    "graphics-photos-graphics",
    "home-living-painting",
    "shoes-women-s-shoes-boots",
    "home-living-home-decor-decorative-pillows",
    "jewelry-accessories-bags-and-purses-handbags",
  ];

  const homeCategories = homeCategorySlugs
    .map((slug) => formattedCategories.find((c: any) => c.slug === slug))
    .filter(Boolean) as typeof formattedCategories;

  return (
    <div className="flex flex-col w-full min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<HeroCarouselSkeleton />}>
          <HeroCarousel />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<CategoryGridSkeleton />}>
          <CategoryGrid categories={homeCategories} />
        </Suspense>
      </ErrorBoundary>

      {/* Special Offers (Carousel) */}
      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <SpecialOffersSection
          activeLangId={activeLangId}
          categoryNameMap={categoryNameMap}
          title={t("specialOffers")}
        />
      </Suspense>

      {/* Double Promotion Banners */}
      <div className="px-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-text-main">{t("promoDeals")}</h2>
        </div>
      </div>
      <DoublePromoBanner />

      {/* Featured Products (Dynamic Load More) */}
      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <FeaturedProductsSectionWrapper
          activeLangId={activeLangId}
          categoryNameMap={categoryNameMap}
          title={t("featuredProducts")}
        />
      </Suspense>

      {/* New Arrivals (Static Grid with View All) */}
      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <NewArrivalsSection
          activeLangId={activeLangId}
          categoryNameMap={categoryNameMap}
          title={t("newArrivals")}
        />
      </Suspense>

      {/* Triple Promotion Banners */}
      <div className="px-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-text-main">{t("shopByCategory")}</h2>
        </div>
      </div>
      <TriplePromoBanner />

      {/* Clothing (Carousel) */}
      {clothingCategory && (
        <Suspense fallback={<ProductGridSectionSkeleton />}>
          <ClothingSection
            activeLangId={activeLangId}
            categoryNameMap={categoryNameMap}
            clothingCategoryId={clothingCategory.id}
            title={t("clothing")}
          />
        </Suspense>
      )}

      {/* Jewelry & Accessories (Carousel) */}
      {jewelryCategory && (
        <Suspense fallback={<ProductGridSectionSkeleton />}>
          <JewelrySection
            activeLangId={activeLangId}
            categoryNameMap={categoryNameMap}
            jewelryCategoryId={jewelryCategory.id}
            title={t("jewelryAccessories")}
          />
        </Suspense>
      )}

      {/* Shop By Brand */}
      <BrandCarouselSection />

      {/* Latest Blog Posts */}
      <BlogCarouselSection />
    </div>
  );
}

/* --- Async Server Component Wrappers to Lazy Load Data via Streaming --- */

async function SpecialOffersSection({
  activeLangId,
  categoryNameMap,
  title,
}: {
  activeLangId: number;
  categoryNameMap: Record<number, string>;
  title: string;
}) {
  const supabase = await createClient();
  const { data } = await (supabase
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
    .not("discount_percent", "is", null)
    .eq("product_translations.language_id", activeLangId)
    .limit(10) as any);

  return (
    <ProductCarouselSection
      title={title}
      products={data || []}
      categoryNameMap={categoryNameMap}
    />
  );
}

async function FeaturedProductsSectionWrapper({
  activeLangId,
  categoryNameMap,
  title,
}: {
  activeLangId: number;
  categoryNameMap: Record<number, string>;
  title: string;
}) {
  const supabase = await createClient();
  const { data } = await (supabase
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
    .eq("is_featured", true)
    .eq("product_translations.language_id", activeLangId)
    .limit(10) as any);

  return (
    <FeaturedProductsSection
      title={title}
      initialProducts={data || []}
      categoryNameMap={categoryNameMap}
      activeLangId={activeLangId}
    />
  );
}

async function NewArrivalsSection({
  activeLangId,
  categoryNameMap,
  title,
}: {
  activeLangId: number;
  categoryNameMap: Record<number, string>;
  title: string;
}) {
  const supabase = await createClient();
  const { data } = await (supabase
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
    .eq("product_translations.language_id", activeLangId)
    .order("created_at", { ascending: false })
    .limit(10) as any);

  return (
    <ProductGridSection
      title={title}
      products={data || []}
      categoryNameMap={categoryNameMap}
    />
  );
}

async function ClothingSection({
  activeLangId,
  categoryNameMap,
  clothingCategoryId,
  title,
}: {
  activeLangId: number;
  categoryNameMap: Record<number, string>;
  clothingCategoryId: number;
  title: string;
}) {
  const supabase = await createClient();
  const { data } = await (supabase
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
    .eq("category_id", clothingCategoryId)
    .eq("product_translations.language_id", activeLangId)
    .limit(10) as any);

  return (
    <ProductCarouselSection
      title={title}
      products={data || []}
      categoryNameMap={categoryNameMap}
    />
  );
}

async function JewelrySection({
  activeLangId,
  categoryNameMap,
  jewelryCategoryId,
  title,
}: {
  activeLangId: number;
  categoryNameMap: Record<number, string>;
  jewelryCategoryId: number;
  title: string;
}) {
  const supabase = await createClient();
  const { data } = await (supabase
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
    .eq("category_id", jewelryCategoryId)
    .eq("product_translations.language_id", activeLangId)
    .limit(10) as any);

  return (
    <ProductCarouselSection
      title={title}
      products={data || []}
      categoryNameMap={categoryNameMap}
    />
  );
}
