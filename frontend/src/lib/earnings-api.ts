import { api, ApiResponse } from "./api-client";

export interface InstructorEarningDetail {
  course_id: number;
  title: string;
  total_students: number;
  earning: number;
}

export interface AdminEarningDetail {
  user_id: number;
  first_name: string;
  last_name: string;
  earning: number;
  instructor_earning: number;
}

export interface EarningsSummary<T = any> {
  total_revenue: number;
  details: T[];
  total: number;
}

export interface EarningsAnalytics {
  month: string;
  revenue: number;
}

export const earningsApi = {
  getSummary: async <T = any>(page = 1, limit = 10): Promise<EarningsSummary<T>> => {
    const response = await api.get<any, ApiResponse<EarningsSummary<T>>>(`/earnings?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAnalytics: async (): Promise<EarningsAnalytics[]> => {
    const response = await api.get<any, ApiResponse<EarningsAnalytics[]>>("/earnings/analytics");
    return response.data;
  },
};
