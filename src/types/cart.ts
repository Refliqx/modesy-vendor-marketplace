export interface NormalizedCartItem {
  id: number;
  productId: number;
  quantity: number;
  slug: string;
  title: string;
  price: number;
  discountPercent: number | null;
  vendorId: number;
  vendorName: string;
  vendorSlug: string;
  shipFromCountry: string | null;
  shipFromState: string | null;
}
