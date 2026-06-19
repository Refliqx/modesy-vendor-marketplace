import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { CurrencyInitializer } from "@/components/currency/CurrencyInitializer";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGridSection } from "@/components/home/ProductGridSection";
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
  const t = await getTranslations("home");

  const { data: langData } = await (supabase
    .from("languages")
    .select()
    .eq("code", locale)
    .single() as any);

  const lang = langData as any;
  const activeLangId = lang?.id || 1;

  const [
    currenciesResponse,
    categoriesResponse,
    specialOffersResponse,
    featuredProductsResponse,
    newArrivalsResponse,
  ] = await Promise.all([
    supabase.from("currencies").select().eq("status", true) as any,
    supabase
      .from("categories")
      .select("id, slug, image_path, category_translations!inner(name)")
      .eq("status", true)
      .eq("category_translations.language_id", activeLangId) as any,
    supabase
      .from("products")
      .select("id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)")
      .eq("status", true)
      .eq("is_draft", false)
      .not("discount_percent", "is", null)
      .eq("product_translations.language_id", activeLangId)
      .limit(10) as any,
    supabase
      .from("products")
      .select("id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)")
      .eq("status", true)
      .eq("is_draft", false)
      .eq("is_featured", true)
      .eq("product_translations.language_id", activeLangId)
      .limit(10) as any,
    supabase
      .from("products")
      .select("id, slug, price, discount_percent, category_id, created_at, product_translations!inner(title, short_description)")
      .eq("status", true)
      .eq("is_draft", false)
      .eq("product_translations.language_id", activeLangId)
      .order("created_at", { ascending: false })
      .limit(10) as any,
  ]);

  const currencies = (currenciesResponse.data as any) || [];
  const categoriesData = (categoriesResponse.data as any) || [];

  const formattedCategories = categoriesData.map((cat: any) => {
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

  const [clothingResponse, jewelryResponse] = await Promise.all([
    clothingCategory
      ? (supabase
          .from("products")
          .select("id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)")
          .eq("status", true)
          .eq("is_draft", false)
          .eq("category_id", clothingCategory.id)
          .eq("product_translations.language_id", activeLangId)
          .limit(10) as any)
      : Promise.resolve({ data: [] }),
    jewelryCategory
      ? (supabase
          .from("products")
          .select("id, slug, price, discount_percent, category_id, product_translations!inner(title, short_description)")
          .eq("status", true)
          .eq("is_draft", false)
          .eq("category_id", jewelryCategory.id)
          .eq("product_translations.language_id", activeLangId)
          .limit(10) as any)
      : Promise.resolve({ data: [] }),
  ]);

  const specialOffers = (specialOffersResponse.data as any) || [];
  const featuredProducts = (featuredProductsResponse.data as any) || [];
  const newArrivals = (newArrivalsResponse.data as any) || [];
  const clothingProducts = (clothingResponse.data as any) || [];
  const jewelryProducts = (jewelryResponse.data as any) || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <CurrencyInitializer currencies={currencies} />

      <ErrorBoundary>
        <Suspense fallback={<HeroCarouselSkeleton />}>
          <HeroCarousel />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<CategoryGridSkeleton />}>
          <CategoryGrid categories={formattedCategories} />
        </Suspense>
      </ErrorBoundary>

      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <ProductGridSection
          title={t("specialOffers")}
          products={specialOffers}
          categoryNameMap={categoryNameMap}
        />
      </Suspense>

      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <ProductGridSection
          title={t("featuredProducts")}
          products={featuredProducts}
          categoryNameMap={categoryNameMap}
        />
      </Suspense>

      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <ProductGridSection
          title={t("newArrivals")}
          products={newArrivals}
          categoryNameMap={categoryNameMap}
        />
      </Suspense>

      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <ProductGridSection
          title={t("clothing")}
          products={clothingProducts}
          categoryNameMap={categoryNameMap}
        />
      </Suspense>

      <Suspense fallback={<ProductGridSectionSkeleton />}>
        <ProductGridSection
          title={t("jewelryAccessories")}
          products={jewelryProducts}
          categoryNameMap={categoryNameMap}
        />
      </Suspense>
    </div>
  );
}
