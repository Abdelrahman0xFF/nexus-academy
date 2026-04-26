import { api, ApiResponse } from "./api-client";

export interface EarningDetail {
  course_id: number;
  title: string;
  total_students: number;
  earning: number;
}

export interface EarningsSummary {
  total_revenue: number;
  details: EarningDetail[];
  total: number;
}

export interface EarningsAnalytics {
  month: string;
  revenue: number;
}

export const earningsApi = {
  getSummary: async (page = 1, limit = 10): Promise<EarningsSummary> => {
    const response = await api.get<any, ApiResponse<EarningsSummary>>(`/earnings?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAnalytics: async (): Promise<EarningsAnalytics[]> => {
    const response = await api.get<any, ApiResponse<EarningsAnalytics[]>>("/earnings/analytics");
    return response.data;
  },
};
