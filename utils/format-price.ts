export function formatPrice(price: string, currency: string) {
  const numeric = Number(price);
  if (!Number.isNaN(numeric)) {
    return `${currency}${numeric.toFixed(2)}`;
  }
  return `${currency}${price}`;
}
