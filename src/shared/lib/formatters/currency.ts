/**
 * Format an integer amount in cents to standard BRL currency string (e.g. 15000 -> "R$ 150,00")
 */
export function formatCentsToBRL(cents: number): string {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Convert standard decimal amount to cents integer (e.g. 150.50 -> 15050)
 */
export function decimalToCents(decimal: number): number {
  return Math.round(decimal * 100);
}

/**
 * Convert cents integer to decimal amount (e.g. 15050 -> 150.50)
 */
export function centsToDecimal(cents: number): number {
  return (cents || 0) / 100;
}

/**
 * Parse raw string digits (e.g. "15000" from a numeric keypad) directly as cents
 */
export function parseRawDigitsToCents(digits: string): number {
  const clean = digits.replace(/\D/g, '');
  if (!clean) return 0;
  return Number.parseInt(clean, 10);
}
