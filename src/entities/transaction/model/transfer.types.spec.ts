import { describe, expect, it } from 'vitest';
import { TransferTransactionSchema } from './transaction.types';

describe('Transfer Transaction Schema Validation', () => {
  it('should validate a correct transfer between two different wallets', () => {
    const validTransfer = {
      sourceWalletId: 'wallet-1',
      destinationWalletId: 'wallet-2',
      amount: 15000,
      title: 'Transferência para poupança',
      date: '2026-09-01T10:00:00.000Z',
    };

    const result = TransferTransactionSchema.safeParse(validTransfer);
    expect(result.success).toBe(true);
  });

  it('should reject transfer when source and destination wallets are identical', () => {
    const invalidTransfer = {
      sourceWalletId: 'wallet-1',
      destinationWalletId: 'wallet-1',
      amount: 15000,
      title: 'Transferência inválida',
      date: '2026-09-01T10:00:00.000Z',
    };

    const result = TransferTransactionSchema.safeParse(invalidTransfer);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'As carteiras de origem e destino devem ser diferentes',
      );
    }
  });
});
