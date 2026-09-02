import { create } from 'zustand';
import { authApi, User } from '@/shared/auth';
import { appStorage, StorageKeys } from '@/shared/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ requiresVerification?: boolean }>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  initAuth: async () => {
    try {
      const storedToken = appStorage.getString(StorageKeys.AUTH_TOKEN);
      const storedUser = appStorage.getObject<User>(StorageKeys.USER_DATA);

      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: storedUser,
          isAuthenticated: true,
          isInitializing: false,
        });

        try {
          const session = await authApi.getSession();
          if (session?.user) {
            appStorage.setObject(StorageKeys.USER_DATA, session.user);
            set({ user: session.user });
          }
        } catch {}
      } else {
        set({ isInitializing: false });
      }
    } catch {
      set({ isInitializing: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signInWithEmail(email, password);
      const { token, user } = response;

      if (token) {
        appStorage.setString(StorageKeys.AUTH_TOKEN, token);
      }
      if (user) {
        appStorage.setObject(StorageKeys.USER_DATA, user);
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      const message =
        err?.message || 'Falha ao autenticar. Verifique suas credenciais.';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signUpWithEmail(name, email, password);

      if (response.token && response.user) {
        appStorage.setString(StorageKeys.AUTH_TOKEN, response.token);
        appStorage.setObject(StorageKeys.USER_DATA, response.user);

        set({
          token: response.token,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { requiresVerification: false };
      }

      set({ isLoading: false });
      return { requiresVerification: true };
    } catch (err: any) {
      const message = err?.message || 'Falha ao criar conta. Tente novamente.';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authApi.signOut();
    } finally {
      appStorage.removeItem(StorageKeys.AUTH_TOKEN);
      appStorage.removeItem(StorageKeys.USER_DATA);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
