import { describe, expect, it } from 'vitest';
import { formatDateFriendly, formatDateFull, formatDateShort } from './date';

describe('Date Formatters', () => {
  it('should format date to short Brazilian standard (dd/MM/yyyy)', () => {
    const date = new Date(2026, 8, 2, 12, 0, 0); // 02/09/2026
    const formatted = formatDateShort(date);
    expect(formatted).toBe('02/09/2026');
  });

  it('should format today date friendly with "Hoje"', () => {
    const today = new Date();
    const formatted = formatDateFriendly(today);
    expect(formatted).toContain('Hoje');
  });

  it('should format full date in Brazilian Portuguese', () => {
    const date = new Date(2026, 8, 2, 12, 0, 0); // 02/09/2026
    const formatted = formatDateFull(date);
    expect(formatted.toLowerCase()).toContain('setembro');
    expect(formatted).toContain('2026');
  });

  it('should handle invalid date gracefully without throwing', () => {
    expect(formatDateShort('invalid-date')).toBe('');
    expect(formatDateFriendly('invalid-date')).toBe('');
  });
});
