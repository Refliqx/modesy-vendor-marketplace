export interface DummyCoupon {
  code: string;
  discountPercent: number;
  label: string; // displayed as "Discount (-{label})"
}

export const dummyCoupons: DummyCoupon[] = [
  { code: 'DISKON10', discountPercent: 10, label: 'DISKON10' },
  { code: 'WELCOME20', discountPercent: 20, label: 'WELCOME20' },
];

// Helper validation (case-insensitive, trim whitespace)
export function validateCoupon(input: string): DummyCoupon | null {
  const normalized = input.trim().toUpperCase();
  return dummyCoupons.find(c => c.code === normalized) ?? null;
}
