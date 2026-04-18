import { api, ApiResponse } from "./api-client";

export interface Category {
  category_id: number;
  name: string;
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<any, ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  create: async (name: string): Promise<Category> => {
    const response = await api.post<any, ApiResponse<Category>>("/categories", { name });
    return response.data;
  },

  update: async (id: number, name: string): Promise<{ message: string }> => {
    const response = await api.put<any, ApiResponse<null>>(`/categories/${id}`, { name });
    return { message: response.message };
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await api.delete<any, ApiResponse<null>>(`/categories/${id}`);
    return response.success;
  },
};
