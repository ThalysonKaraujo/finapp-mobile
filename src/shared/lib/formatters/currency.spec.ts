import { describe, expect, it } from 'vitest';
import {
  centsToDecimal,
  decimalToCents,
  formatCentsToBRL,
  parseRawDigitsToCents,
} from './currency';

describe('Currency Formatters', () => {
  it('should format cents to BRL currency string correctly', () => {
    // Standard positive amount
    const formatted = formatCentsToBRL(15000);
    expect(formatted).toContain('150,00');

    // Zero amount
    expect(formatCentsToBRL(0)).toContain('0,00');

    // Fractional cents
    expect(formatCentsToBRL(1099)).toContain('10,99');
  });

  it('should convert decimal amount to integer cents', () => {
    expect(decimalToCents(150.5)).toBe(15050);
    expect(decimalToCents(0)).toBe(0);
    expect(decimalToCents(99.99)).toBe(9999);
  });

  it('should convert cents integer to decimal amount', () => {
    expect(centsToDecimal(15050)).toBe(150.5);
    expect(centsToDecimal(0)).toBe(0);
    expect(centsToDecimal(9999)).toBe(99.99);
  });

  it('should parse raw digits string directly to integer cents', () => {
    expect(parseRawDigitsToCents('15000')).toBe(15000);
    expect(parseRawDigitsToCents('R$ 150,00')).toBe(15000);
    expect(parseRawDigitsToCents('')).toBe(0);
    expect(parseRawDigitsToCents('abc')).toBe(0);
  });
});
