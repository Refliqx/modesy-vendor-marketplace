const formatterCache = new Map<string, Intl.NumberFormat>();

export function formatPrice(amount: number, code: string): string {
  let formatter = formatterCache.get(code);
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    });
    formatterCache.set(code, formatter);
  }
  return formatter.format(amount);
}
