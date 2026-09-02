import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { appStorage, StorageKeys } from '../storage';
import { API_BASE_URL } from './endpoints';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Origin: 'http://localhost:3000',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = appStorage.getString(StorageKeys.AUTH_TOKEN);
    if (config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (!config.headers.Origin) {
        config.headers.Origin = 'http://localhost:3000';
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      message?: string | string[];
      error?: string;
      code?: string;
    }>,
  ) => {
    let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';

    if (error.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      }
    } else if (error.message === 'Network Error') {
      errorMessage =
        'Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está rodando.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Tempo de conexão esgotado. Tente novamente.';
    }

    return Promise.reject(new Error(errorMessage));
  },
);
