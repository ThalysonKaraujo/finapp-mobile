import { apiClient, ENDPOINTS } from '@/shared/api';
import {
  CreateObjectiveInput,
  DepositWithdrawInput,
  Objective,
  UpdateObjectiveInput,
} from '../model/objective.types';

export const objectiveApi = {
  getObjectives: async (): Promise<Objective[]> => {
    const response = await apiClient.get<Objective[]>(
      ENDPOINTS.OBJECTIVES.LIST,
    );
    return response.data;
  },

  getObjectiveById: async (id: string): Promise<Objective> => {
    const response = await apiClient.get<Objective>(
      ENDPOINTS.OBJECTIVES.DETAIL(id),
    );
    return response.data;
  },

  createObjective: async (data: CreateObjectiveInput): Promise<Objective> => {
    const response = await apiClient.post<Objective>(
      ENDPOINTS.OBJECTIVES.CREATE,
      data,
    );
    return response.data;
  },

  updateObjective: async (
    id: string,
    data: UpdateObjectiveInput,
  ): Promise<Objective> => {
    const response = await apiClient.patch<Objective>(
      ENDPOINTS.OBJECTIVES.UPDATE(id),
      data,
    );
    return response.data;
  },

  finalizeObjective: async (id: string): Promise<Objective> => {
    const response = await apiClient.patch<Objective>(
      ENDPOINTS.OBJECTIVES.UPDATE(id),
      { isCompleted: true },
    );
    return response.data;
  },

  reopenObjective: async (id: string): Promise<Objective> => {
    const response = await apiClient.patch<Objective>(
      ENDPOINTS.OBJECTIVES.UPDATE(id),
      { isCompleted: false },
    );
    return response.data;
  },

  deposit: async (
    id: string,
    data: DepositWithdrawInput,
  ): Promise<Objective> => {
    const response = await apiClient.post<Objective>(
      ENDPOINTS.OBJECTIVES.DEPOSIT(id),
      data,
    );
    return response.data;
  },

  withdraw: async (
    id: string,
    data: DepositWithdrawInput,
  ): Promise<Objective> => {
    const response = await apiClient.post<Objective>(
      ENDPOINTS.OBJECTIVES.WITHDRAW(id),
      data,
    );
    return response.data;
  },

  deleteObjective: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(ENDPOINTS.OBJECTIVES.DELETE(id));
    return response.data;
  },
};
