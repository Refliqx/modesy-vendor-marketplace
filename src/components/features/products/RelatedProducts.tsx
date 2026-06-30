"use client";

import { ProductGridSection } from "@/components/home/ProductGridSection";
import { dummyProducts } from "@/lib/dummy/products";

interface RelatedProductsProps {
  currentProduct: {
    id: number;
    categoryName: string;
    category_id?: number | null;
  };
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  // Filters dummy products from the same category
  const related = dummyProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.categoryName === currentProduct.categoryName
    )
    .slice(0, 10);

  if (related.length === 0) return null;

  const adaptedProducts = related.map((p) => ({
    id: p.id,
    slug: p.slug,
    price: p.price,
    discount_percent: p.discountPercent,
    category_id: null,
    seller_name: p.sellerName,
    seller_slug: p.sellerSlug,
    rating: p.rating,
    review_count: p.reviewCount,
    product_translations: {
      title: p.title,
      short_description: p.description,
    },
  }));

  return (
    <ProductGridSection
      title="You May Also Like"
      products={adaptedProducts}
      categoryNameMap={{}}
    />
  );
}
