"use client";

import { ProductGridSection } from "@/components/home/ProductGridSection";
import { dummyProducts } from "@/lib/dummy/products";

interface VendorProductsProps {
  currentProduct: {
    id: number;
    vendor_id?: number | null;
    sellerSlug?: string;
    sellerName?: string;
  };
}

export function VendorProducts({ currentProduct }: VendorProductsProps) {
  // Filters dummy products from the same vendor
  const vendorProducts = dummyProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        (currentProduct.sellerSlug
          ? p.sellerSlug === currentProduct.sellerSlug
          : p.sellerName === currentProduct.sellerName)
    )
    .slice(0, 10);

  if (vendorProducts.length === 0) return null;

  const adaptedProducts = vendorProducts.map((p) => ({
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
      title={`More From ${currentProduct.sellerName || "This Vendor"}`}
      products={adaptedProducts}
      categoryNameMap={{}}
    />
  );
}
