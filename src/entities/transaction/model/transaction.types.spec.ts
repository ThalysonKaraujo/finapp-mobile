import { describe, expect, it } from 'vitest';
import {
  CreateTransactionSchema,
  TransactionSchema,
  UpdateTransactionSchema,
} from './transaction.types';

describe('Transaction Schemas Validation', () => {
  it('should validate a valid transaction object', () => {
    const validTransaction = {
      id: 'tx-123',
      amount: 15000,
      type: 'INCOME' as const,
      title: 'Salário',
      date: '2026-09-01T10:00:00.000Z',
      userId: 'user-123',
    };

    const result = TransactionSchema.safeParse(validTransaction);
    expect(result.success).toBe(true);
  });

  it('should validate CreateTransactionSchema with positive amount', () => {
    const validCreateInput = {
      title: 'Supermercado',
      amount: 5490, // R$ 54,90
      type: 'EXPENSE' as const,
      date: '2026-09-01T10:00:00.000Z',
    };

    const result = CreateTransactionSchema.safeParse(validCreateInput);
    expect(result.success).toBe(true);
  });

  it('should reject non-positive amount in CreateTransactionSchema', () => {
    const invalidInput = {
      title: 'Supermercado',
      amount: 0,
      type: 'EXPENSE' as const,
      date: '2026-09-01T10:00:00.000Z',
    };

    const result = CreateTransactionSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'O valor deve ser maior que zero',
      );
    }
  });

  it('should reject title shorter than 2 characters', () => {
    const invalidInput = {
      title: 'A',
      amount: 1000,
      type: 'EXPENSE' as const,
      date: '2026-09-01T10:00:00.000Z',
    };

    const result = CreateTransactionSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'O título deve ter pelo menos 2 caracteres',
      );
    }
  });

  it('should validate partial UpdateTransactionSchema', () => {
    const validPartialInput = {
      title: 'Novo Título',
      updateFutureInstallments: true,
    };

    const result = UpdateTransactionSchema.safeParse(validPartialInput);
    expect(result.success).toBe(true);
  });
});
