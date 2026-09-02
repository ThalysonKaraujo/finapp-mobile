import { apiClient, ENDPOINTS } from '@/shared/api';
import {
  CreateTransactionInput,
  PaginatedTransactionsResponse,
  Transaction,
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

  deleteTransaction: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(ENDPOINTS.TRANSACTIONS.DELETE(id));
    return response.data;
  },
};
