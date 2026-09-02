import { apiClient, ENDPOINTS } from '@/shared/api';
import { Category, CreateCategoryInput } from '../model/category.types';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient.post<Category>(
      ENDPOINTS.CATEGORIES.CREATE,
      data,
    );
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(ENDPOINTS.CATEGORIES.DELETE(id));
    return response.data;
  },
};
