import { describe, expect, it } from 'vitest';
import {
  CreateObjectiveSchema,
  DepositWithdrawSchema,
  ObjectiveSchema,
} from './objective.types';

describe('Objective Schemas Validation', () => {
  it('should validate a complete objective entity', () => {
    const obj = {
      id: 'obj-1',
      name: 'Reserva de Emergência',
      targetAmount: 500000,
      currentAmount: 100000,
      deadline: '2027-01-01T00:00:00.000Z',
    };
    const result = ObjectiveSchema.safeParse(obj);
    expect(result.success).toBe(true);
  });

  it('should validate CreateObjectiveSchema with positive target amount', () => {
    const input = {
      name: 'Viagem para a praia',
      targetAmount: 200000,
    };
    const result = CreateObjectiveSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject non-positive target amount', () => {
    const input = {
      name: 'Viagem',
      targetAmount: 0,
    };
    const result = CreateObjectiveSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate DepositWithdrawSchema with positive amount', () => {
    const valid = { amount: 5000 };
    expect(DepositWithdrawSchema.safeParse(valid).success).toBe(true);

    const invalid = { amount: -50 };
    expect(DepositWithdrawSchema.safeParse(invalid).success).toBe(false);
  });
});
