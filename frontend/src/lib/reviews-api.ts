import { api, ApiResponse } from "./api-client";

export interface Review {
  user_id: number;
  course_id: number;
  rating: number;
  comment: string;
  reviewed_at: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface InstructorReview extends Review {
  course_title: string;
}

export const reviewApi = {
  create: async (courseId: number, data: { rating: number; comment: string }): Promise<ApiResponse<null>> => {
    return api.post<any, ApiResponse<null>>(`/reviews/${courseId}`, data);
  },

  getByCourse: async (courseId: number, params?: { page?: number; limit?: number; sortBy?: string; order?: string }): Promise<{ reviews: Review[]; total: number }> => {
    const response = await api.get<any, ApiResponse<{ reviews: Review[]; total: number }>>(`/reviews/${courseId}`, { params });
    return response.data;
  },

  getUserReview: async (courseId: number): Promise<ApiResponse<Review>> => {
    return api.get<any, ApiResponse<Review>>(`/reviews/${courseId}/me`);
  },

  getInstructorReviews: async (params?: { page?: number; limit?: number; course_id?: number | string; rating?: number | string; search?: string }): Promise<{ reviews: InstructorReview[]; total: number }> => {
    const response = await api.get<any, ApiResponse<{ reviews: InstructorReview[]; total: number }>>(`/reviews/instructor`, { params });
    return response.data;
  },

  update: async (courseId: number, data: { rating: number; comment: string }): Promise<ApiResponse<null>> => {
    return api.put<any, ApiResponse<null>>(`/reviews/${courseId}`, data);
  },

  delete: async (courseId: number): Promise<ApiResponse<null>> => {
    return api.delete<any, ApiResponse<null>>(`/reviews/${courseId}`);
  },
};
