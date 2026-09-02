import { apiClient, ENDPOINTS } from '@/shared/api';
import { CreateWalletInput, Wallet } from '../model/wallet.types';

export const walletApi = {
  getWallets: async (): Promise<Wallet[]> => {
    const response = await apiClient.get<Wallet[]>(ENDPOINTS.WALLETS.LIST);
    return response.data;
  },

  createWallet: async (data: CreateWalletInput): Promise<Wallet> => {
    const response = await apiClient.post<Wallet>(
      ENDPOINTS.WALLETS.CREATE,
      data,
    );
    return response.data;
  },
};
