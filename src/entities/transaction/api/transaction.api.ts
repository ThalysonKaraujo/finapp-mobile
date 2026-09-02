import { apiClient, ENDPOINTS } from '@/shared/api';
import {
  CreateTransactionInput,
  PaginatedTransactionsResponse,
  Transaction,
  TransferTransactionInput,
  UpdateTransactionInput,
} from '../model/transaction.types';

export const transactionApi = {
  getTransactions: async (
    page = 1,
    limit = 20,
  ): Promise<PaginatedTransactionsResponse> => {
    const response = await apiClient.get<PaginatedTransactionsResponse>(
      ENDPOINTS.TRANSACTIONS.LIST,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(
      ENDPOINTS.TRANSACTIONS.DETAIL(id),
    );
    return response.data;
  },

  createTransaction: async (
    data: CreateTransactionInput,
  ): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(
      ENDPOINTS.TRANSACTIONS.CREATE,
      data,
    );
    return response.data;
  },

  updateTransaction: async (
    id: string,
    data: UpdateTransactionInput,
  ): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(
      ENDPOINTS.TRANSACTIONS.UPDATE(id),
      data,
    );
    return response.data;
  },

  transfer: async (
    data: TransferTransactionInput,
  ): Promise<{ transferOut: Transaction; transferIn: Transaction }> => {
    const response = await apiClient.post<{
      transferOut: Transaction;
      transferIn: Transaction;
    }>(ENDPOINTS.TRANSACTIONS.TRANSFER, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(ENDPOINTS.TRANSACTIONS.DELETE(id));
    return response.data;
  },
};
