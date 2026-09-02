import { z } from 'zod';

export const WalletSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome da carteira é obrigatório'),
  balance: z.number(), // Em centavos
  userId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Wallet = z.infer<typeof WalletSchema>;

export const CreateWalletSchema = z.object({
  name: z.string().min(1, 'O nome da carteira é obrigatório'),
  balance: z.number().default(0),
});

export type CreateWalletInput = z.infer<typeof CreateWalletSchema>;
