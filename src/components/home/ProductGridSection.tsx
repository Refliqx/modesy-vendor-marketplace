import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/features/products/ProductCard";

interface ProductItem {
  id: number;
  slug: string;
  price: number;
  discount_percent: number | null;
  category_id: number | null;
  product_translations: { title: string; short_description: string | null }[] | { title: string; short_description: string | null };
}

interface ProductGridSectionProps {
  title: string;
  viewAllHref?: string;
  products: ProductItem[] | null | undefined;
  categoryNameMap: Record<number, string>;
}

export function ProductGridSection({
  title,
  viewAllHref = "#",
  products,
  categoryNameMap,
}: ProductGridSectionProps) {
  const t = useTranslations();
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-screen-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl md:text-[22px] font-bold text-[#1F2937]">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-primary hover:underline">
          {t("loadMore.viewAll")} →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.slice(0, 10).map((product) => {
          const translations = product.product_translations;
          const translation = Array.isArray(translations) ? translations[0] : translations;
          const title = translation?.title ?? "";
          const categoryName = product.category_id != null ? (categoryNameMap[product.category_id] ?? "") : "";
          return (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName}
              title={title}
            />
          );
        })}
      </div>
    </section>
  );
}
