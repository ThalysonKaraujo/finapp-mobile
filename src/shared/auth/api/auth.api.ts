import { apiClient, ENDPOINTS } from '@/shared/api';
import {
  AuthSession,
  SignInResponse,
  SignUpResponse,
  User,
} from '../model/auth.types';

export const authApi = {
  signInWithEmail: async (
    email: string,
    password: string,
  ): Promise<SignInResponse> => {
    const response = await apiClient.post<SignInResponse>(
      ENDPOINTS.AUTH.SIGN_IN_EMAIL,
      { email, password },
    );
    return response.data;
  },

  signUpWithEmail: async (
    name: string,
    email: string,
    password: string,
  ): Promise<SignUpResponse> => {
    const response = await apiClient.post<SignUpResponse>(
      ENDPOINTS.AUTH.SIGN_UP_EMAIL,
      { name, email, password },
    );
    return response.data;
  },

  signOut: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.SIGN_OUT);
    } catch {
      // Best effort sign out
    }
  },

  getSession: async (): Promise<AuthSession | null> => {
    try {
      const response = await apiClient.get<{ user: User }>(
        ENDPOINTS.AUTH.GET_SESSION,
      );
      if (response.data?.user) {
        return { user: response.data.user };
      }
      return null;
    } catch {
      return null;
    }
  },
};
