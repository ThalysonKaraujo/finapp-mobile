import { z } from 'zod';

export const ObjectiveSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome do objetivo é obrigatório'),
  targetAmount: z.number().positive('O valor alvo deve ser positivo'),
  currentAmount: z.number().default(0),
  color: z.string().default('#0066FF'),
  deadline: z.string().nullable().optional(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Objective = z.infer<typeof ObjectiveSchema>;

export const CreateObjectiveSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  targetAmount: z.number().positive('O valor alvo deve ser maior que zero'),
  color: z.string().default('#0066FF'),
  deadline: z.string().optional(),
});

export type CreateObjectiveInput = z.infer<typeof CreateObjectiveSchema>;

export const DepositWithdrawSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
});

export type DepositWithdrawInput = z.infer<typeof DepositWithdrawSchema>;
