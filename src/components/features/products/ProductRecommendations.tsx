"use client";

import { VendorProducts } from "./VendorProducts";
import { RelatedProducts } from "./RelatedProducts";
import type { DummyProduct } from "@/lib/dummy/products";

interface ProductRecommendationsProps {
  product: DummyProduct;
}

export function ProductRecommendations({ product }: ProductRecommendationsProps) {
  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <VendorProducts currentProduct={product} />
      <RelatedProducts currentProduct={product} />
    </div>
  );
}
