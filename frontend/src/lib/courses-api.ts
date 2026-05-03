import { api, ApiResponse } from "./api-client";

export interface Course {
  course_id: number;
  category_id: number;
  instructor_id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  thumbnail_url: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  is_available: boolean;
  rating: number;
  review_count?: number;
  duration: number;
  created_at: string;
  category_name?: string;
  instructor_name?: string;
  instructor_avatar?: string;
  students_count?: number;
  is_enrolled?: boolean;
}

export interface CourseContent {
  course_id: number;
  title: string;
  duration: number;
  is_enrolled: boolean;
  sections: {
    section_order: number;
    title: string;
    lessons: {
      lesson_order: number;
      title: string;
      duration: number;
      is_completed?: boolean;
      video_url?: string;
      description?: string;
    }[];
  }[];
}

export interface Section {
  course_id: number;
  section_order: number;
  title: string;
}

export interface Lesson {
  course_id: number;
  section_order: number;
  lesson_order: number;
  title: string;
  description?: string;
  video_url: string;
  duration: number;
}

export interface LessonForm {
  title: string;
  description: string;
  video: File | null;
  isNew?: boolean;
  video_url?: string;
  original_lesson_order?: number;
}

export interface SectionForm {
  title: string;
  lessons: LessonForm[];
  isNew?: boolean;
  original_section_order?: number;
}

export const coursesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    level?: string;
    sortBy?: string;
    order?: string;
    is_available?: boolean;
  }): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<any, ApiResponse<{ courses: Course[]; total: number }>>("/courses", { params });
    return response.data;
  },

  getRecentCourses: async (limit = 5): Promise<Course[]> => {
    const response = await api.get<any, ApiResponse<{ courses: Course[] }>>(`/courses/recent?limit=${limit}`);
    return response.data.courses;
  } ,
  
  create: async (formData: FormData): Promise<Course> => {
    const response = await api.post<any, ApiResponse<Course>>("/courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Course> => {
    const response = await api.put<any, ApiResponse<Course>>(`/courses/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<any, ApiResponse<null>>(`/courses/${id}`);
  },

  getById: async (id: number): Promise<Course> => {
    const response = await api.get<any, ApiResponse<Course>>(`/courses/${id}`);
    return response.data;
  },

  getMyCourses: async (page = 1, limit = 10, params?: { search?: string; category_id?: number; is_available?: boolean }): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<any, ApiResponse<{ courses: Course[]; total: number }>>(`/courses/my`, { 
      params: { page, limit, ...params } 
    });
    return response.data;
  },

  getCoursesByInstructorId: async (instructorId: number, page = 1, limit = 10, params?: { search?: string; category_id?: number; is_available?: boolean }): Promise<{ courses: Course[]; total: number }> => {
    const response = await api.get<any, ApiResponse<{ courses: Course[]; total: number }>>(`/courses/instructor/${instructorId}`, { 
      params: { page, limit, ...params } 
    });
    return response.data;
  },

  getStats: async (id: number): Promise<{ students: number; revenue: number; rating: number }> => {
    const response = await api.get<any, ApiResponse<{ students: number; revenue: number; rating: number }>>(`/courses/${id}/stats`);
    return response.data;
  },

  getCourseContent: async (id: number): Promise<CourseContent> => {
    const response = await api.get<any, ApiResponse<CourseContent>>(`/courses/${id}/content`);
    return response.data;
  },
};

export const sectionsApi = {
  create: async (data: { course_id: number; section_order: number; title: string }): Promise<Section> => {
    const response = await api.post<any, ApiResponse<Section>>("/sections", data);
    return response.data;
  },

  update: async (courseId: number, sectionOrder: number, title: string): Promise<void> => {
    await api.put<any, ApiResponse<null>>(`/sections/${courseId}/${sectionOrder}`, { title });
  },

  delete: async (courseId: number, sectionOrder: number): Promise<void> => {
    await api.delete<any, ApiResponse<null>>(`/sections/${courseId}/${sectionOrder}`);
  },
};

export const lessonsApi = {
  create: async (formData: FormData): Promise<Lesson> => {
    const response = await api.post<any, ApiResponse<Lesson>>("/lessons", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (courseId: number, sectionOrder: number, lessonOrder: number, formData: FormData): Promise<void> => {
    await api.put<any, ApiResponse<null>>(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (courseId: number, sectionOrder: number, lessonOrder: number): Promise<void> => {
    await api.delete<any, ApiResponse<null>>(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}`);
  },

  complete: async (courseId: number, sectionOrder: number, lessonOrder: number): Promise<void> => {
    await api.post<any, ApiResponse<null>>(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}/complete`);
  },
};
