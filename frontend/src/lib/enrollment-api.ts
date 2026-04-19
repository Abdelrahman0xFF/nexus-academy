import { api, ApiResponse } from "./api-client";

export interface Enrollment {
  course_id: number;
  user_id: number;
  enrolled_at: string;
  payment_method: string;
  payment_status: string;
  enrollment_cost: number;
  title: string;
  thumbnail_url?: string;
  instructor_id: number;
  instructor_first_name: string;
  instructor_last_name: string;
  progress: number;
}

export const enrollmentApi = {
  getMyEnrollments: async (page = 1, limit = 10): Promise<ApiResponse<Enrollment[]>> => {
    return api.get<never, ApiResponse<Enrollment[]>>(`/enrollments/my?page=${page}&limit=${limit}`);
  },

  enroll: async (courseId: number, paymentMethod = "card"): Promise<ApiResponse<null>> => {
    return api.post<{ course_id: number; payment_method: string }, ApiResponse<null>>("/enrollments", {
      course_id: courseId,
      payment_method: paymentMethod,
    });
  },

  unenroll: async (courseId: number): Promise<ApiResponse<null>> => {
    return api.delete<any, ApiResponse<null>>("/enrollments", {
      data: { course_id: courseId },
    });
  },

  getProgress: async (courseId: number): Promise<ApiResponse<{ progress: number }>> => {
    return api.get<never, ApiResponse<{ progress: number }>>(`/enrollments/progress/${courseId}`);
  },
};
