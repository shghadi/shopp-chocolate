export function formatNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatPrice(value: number) {
  return `${formatNumber(value)} تومان`;
}
