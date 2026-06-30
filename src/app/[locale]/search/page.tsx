import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/features/products/ProductCard";
import { Search } from "lucide-react";
import type { Metadata } from "next";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;

  if (!["en", "ar"].includes(locale)) notFound();

  const t = await getTranslations("search");
  const query = q?.trim() ?? "";

  const supabase = await createClient();

  const { data: langData } = await (supabase
    .from("languages")
    .select("id")
    .eq("code", locale)
    .single() as any);

  const activeLangId = (langData as any)?.id ?? 1;

  const { data: categoryNameRows } = await (supabase
    .from("category_translations")
    .select("category_id, name")
    .eq("language_id", activeLangId) as any);

  const categoryNameMap: Record<number, string> = {};
  for (const row of (categoryNameRows ?? []) as any[]) {
    if (row.category_id) categoryNameMap[row.category_id] = row.name;
  }

  let products: any[] = [];
  let totalCount = 0;

  if (query.length >= 2) {
    const { data: translationRows, count } = await (supabase
      .from("product_translations")
      .select(
        "title, short_description, product_id, products!inner(id, slug, price, discount_percent, category_id, status, is_draft)",
        { count: "exact" }
      )
      .eq("language_id", activeLangId)
      .ilike("title", `%${query}%`)
      .eq("products.status", true)
      .eq("products.is_draft", false)
      .limit(40) as any);

    totalCount = count ?? 0;

    products = (translationRows ?? []).map((row: any) => ({
      id: row.products?.id ?? row.product_id,
      slug: row.products?.slug ?? "",
      price: row.products?.price ?? 0,
      discount_percent: row.products?.discount_percent ?? null,
      category_id: row.products?.category_id ?? null,
      title: row.title,
      short_description: row.short_description,
    }));
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">
          {t("results")}{" "}
          {query && (
            <span className="text-primary">&ldquo;{query}&rdquo;</span>
          )}
        </h1>
        {query && (
          <p className="text-sm text-text-muted mt-1">
            {totalCount} {t("products").toLowerCase()}
          </p>
        )}
      </div>

      {!query || query.length < 2 ? (
        <EmptyState message={t("placeholder")} icon />
      ) : products.length === 0 ? (
        <EmptyState
          message={`${t("noResults")} "${query}"`}
          subtitle={t("tryDifferent")}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={p.category_id ? (categoryNameMap[p.category_id] ?? "") : ""}
              title={p.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  message,
  subtitle,
  icon,
}: {
  message: string;
  subtitle?: string;
  icon?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      {icon && <Search size={48} className="text-gray-200" />}
      <p className="text-lg font-semibold text-text-main">{message}</p>
      {subtitle && <p className="text-sm text-text-muted max-w-sm">{subtitle}</p>}
    </div>
  );
}
