import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN_EMAIL: '/auth/sign-in/email',
    SIGN_UP_EMAIL: '/auth/sign-up/email',
    SIGN_OUT: '/auth/sign-out',
    GET_SESSION: '/auth/get-session',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    TRANSFER: '/transactions/transfer',
    DETAIL: (id: string) => `/transactions/${id}`,
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
  },
  WALLETS: {
    LIST: '/wallets',
    CREATE: '/wallets',
    DETAIL: (id: string) => `/wallets/${id}`,
    UPDATE: (id: string) => `/wallets/${id}`,
    DELETE: (id: string) => `/wallets/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  OBJECTIVES: {
    LIST: '/objectives',
    CREATE: '/objectives',
    DETAIL: (id: string) => `/objectives/${id}`,
    UPDATE: (id: string) => `/objectives/${id}`,
    DELETE: (id: string) => `/objectives/${id}`,
    DEPOSIT: (id: string) => `/objectives/${id}/deposit`,
    WITHDRAW: (id: string) => `/objectives/${id}/withdraw`,
  },
  REPORTS: {
    MONTHLY: '/reports/monthly',
  },
  BUDGETS: {
    LIST: '/budgets',
    CREATE: '/budgets',
    DETAIL: (id: string) => `/budgets/${id}`,
    UPDATE: (id: string) => `/budgets/${id}`,
    DELETE: (id: string) => `/budgets/${id}`,
  },
} as const;
