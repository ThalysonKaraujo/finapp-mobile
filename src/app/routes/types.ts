import { Transaction } from '@/entities/transaction';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  TransactionsFeed: undefined;
  CreateTransaction: undefined;
  TransactionDetails: { transaction: Transaction };
};
