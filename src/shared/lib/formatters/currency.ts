export function formatCentsToBRL(cents: number): string {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function decimalToCents(decimal: number): number {
  return Math.round(decimal * 100);
}

export function centsToDecimal(cents: number): number {
  return (cents || 0) / 100;
}

export function parseRawDigitsToCents(digits: string): number {
  const clean = digits.replace(/\D/g, '');
  if (!clean) return 0;
  return Number.parseInt(clean, 10);
}
