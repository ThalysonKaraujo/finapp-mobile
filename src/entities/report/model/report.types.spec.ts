import { describe, expect, it } from 'vitest';
import { MonthlyReportSchema } from './report.types';

describe('Report Schemas Validation', () => {
  it('should validate a complete monthly report object', () => {
    const report = {
      incomes: 500000,
      expenses: 320000,
      balance: 180000,
      expensesByCategory: [
        {
          categoryId: 'cat-1',
          name: 'Alimentação',
          color: '#0066FF',
          total: 120000,
        },
        {
          categoryId: 'cat-2',
          name: 'Transporte',
          color: '#10B981',
          total: 200000,
        },
      ],
    };

    const result = MonthlyReportSchema.safeParse(report);
    expect(result.success).toBe(true);
  });
});
