import { z } from 'zod';

export const CategoryExpenseSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  color: z.string(),
  total: z.number(),
});

export type CategoryExpense = z.infer<typeof CategoryExpenseSchema>;

export const BudgetComparisonSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  color: z.string(),
  percentage: z.number(),
  idealExpense: z.number().optional(),
  difference: z.number().optional(),
  percentageUsed: z.number().optional(),
});

export type BudgetComparison = z.infer<typeof BudgetComparisonSchema>;

export const MonthlyReportSchema = z.object({
  incomes: z.number(),
  expenses: z.number(),
  balance: z.number(),
  expensesByCategory: z.array(CategoryExpenseSchema),
  budgetComparison: z.array(BudgetComparisonSchema).optional(),
});

export type MonthlyReport = z.infer<typeof MonthlyReportSchema>;
