import { z } from 'zod';

export const TransactionTypeEnum = z.enum([
  'INCOME',
  'EXPENSE',
  'TRANSFER_IN',
  'TRANSFER_OUT',
]);

export type TransactionType = z.infer<typeof TransactionTypeEnum>;

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(), // In cents
  type: TransactionTypeEnum,
  title: z.string(),
  date: z.string(), // ISO string
  userId: z.string(),
  walletId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  recurrenceId: z.string().nullable().optional(),
  installmentNumber: z.number().nullable().optional(),
  totalInstallments: z.number().nullable().optional(),
  linkedTransactionId: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'A data é obrigatória'),
  walletId: z.string().optional(),
  categoryId: z.string().optional(),
  installments: z.number().min(1).optional(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

export const TransferTransactionSchema = z
  .object({
    sourceWalletId: z.string().min(1, 'Selecione a carteira de origem'),
    destinationWalletId: z.string().min(1, 'Selecione a carteira de destino'),
    amount: z.number().positive('O valor deve ser maior que zero'),
    title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
    date: z.string().min(1, 'A data é obrigatória'),
  })
  .refine((data) => data.sourceWalletId !== data.destinationWalletId, {
    message: 'As carteiras de origem e destino devem ser diferentes',
    path: ['destinationWalletId'],
  });

export type TransferTransactionInput = z.infer<
  typeof TransferTransactionSchema
>;

export interface TransactionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTransactionsResponse {
  data: Transaction[];
  meta: TransactionsMeta;
}
