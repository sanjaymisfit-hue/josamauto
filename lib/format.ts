export function formatKES(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number): string {
  return `${new Intl.NumberFormat("en-KE").format(value)} km`;
}
