import { apiClient, ENDPOINTS } from '@/shared/api';
import { MonthlyReport } from '../model/report.types';

export const reportApi = {
  getMonthlySummary: async (
    month: number,
    year: number,
  ): Promise<MonthlyReport> => {
    const response = await apiClient.get<MonthlyReport>(
      ENDPOINTS.REPORTS.MONTHLY,
      {
        params: { month, year },
      },
    );
    return response.data;
  },
};
