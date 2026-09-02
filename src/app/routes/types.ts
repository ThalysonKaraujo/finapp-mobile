import { Objective } from '@/entities/objective';
import { Transaction } from '@/entities/transaction';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  TransactionsTab: undefined;
  WalletsAndObjectivesTab: undefined;
  ReportsTab: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  CreateTransaction: undefined;
  CreateWallet: undefined;
  CreateCategory: undefined;
  CreateObjective: undefined;
  DepositWithdrawObjective: {
    objective: Objective;
    mode?: 'DEPOSIT' | 'WITHDRAW';
  };
  Transfer: undefined;
  TransactionDetails: { transaction: Transaction };
};
