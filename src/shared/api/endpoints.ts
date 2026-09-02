import { Platform } from 'react-native';

/**
 * Configure API Base URL:
 * - iOS Simulator / Web: http://localhost:3000
 * - Android Emulator: http://10.0.2.2:3000
 * - Physical Device: Change to your local LAN IP (e.g., http://192.168.1.50:3000)
 */
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
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
  },
} as const;
