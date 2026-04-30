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

export interface InstructorStudent {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  joined_at: string;
  courses_enrolled: number;
  avg_progress: number;
  courses?: {
    course_id: number;
    title: string;
    enrolled_at: string;
    progress: number;
  }[];
}


export const enrollmentApi = {
  getInstructorStudents: async (page = 1, limit = 100, search?: string, courseId?: number): Promise<ApiResponse<{ students: InstructorStudent[]; total: number }>> => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const courseParam = courseId ? `&course_id=${courseId}` : '';
    return api.get<never, ApiResponse<{ students: InstructorStudent[]; total: number }>>(`/enrollments/instructor/students?page=${page}&limit=${limit}${searchParam}${courseParam}`);
  },

  getInstructorEnrollments: async (page = 1, limit = 10, courseId?: number): Promise<ApiResponse<{ enrollments: any[]; total: number }>> => {
    const courseParam = courseId ? `&course_id=${courseId}` : '';
    return api.get<never, ApiResponse<{ enrollments: any[]; total: number }>>(`/enrollments/instructor?page=${page}&limit=${limit}${courseParam}`);
  },

  getAll: async (params?: { page?: number; limit?: number; search?: string; course_id?: number; payment_status?: string }): Promise<ApiResponse<{ enrollments: any[]; total: number }>> => {
    return api.get<never, ApiResponse<{ enrollments: any[]; total: number }>>("/enrollments/", { params });
  },

  getMyEnrollments: async (page = 1, limit = 10, params?: { search?: string; status?: string }): Promise<ApiResponse<{ enrollments: any[]; total: number }>> => {
    return api.get<never, ApiResponse<{ enrollments: any[]; total: number }>>(`/enrollments/my`, { 
        params: { page, limit, ...params } 
    });
  },

  enroll: async (courseId: number, paymentMethod = "card"): Promise<ApiResponse<null>> => {
    return api.post<{ course_id: number; payment_method: string }, ApiResponse<null>>("/enrollments", {
      course_id: courseId,
      payment_method: paymentMethod,
    });
  },

  unenroll: async (courseId: number, userId?: number): Promise<ApiResponse<null>> => {
    return api.delete<any, ApiResponse<null>>("/enrollments", {
      data: { course_id: courseId, user_id: userId },
    });
  },

  getProgress: async (courseId: number): Promise<ApiResponse<{ progress: number }>> => {
    return api.get<never, ApiResponse<{ progress: number }>>(`/enrollments/progress/${courseId}`);
  },
};
