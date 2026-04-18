import { api, ApiResponse } from "./api-client";
import { Category } from './data'

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category, ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  create: async (name: string): Promise<Category> => {
    const response = await api.post<Category, ApiResponse<Category>>("/categories", { name });
    return response.data;
  },

  update: async (id: number, name: string): Promise<{ message: string }> => {
    const response = await api.put<Category, ApiResponse<null>>(`/categories/${id}`, { name });
    return { message: response.message };
  },

  delete: async (id: number): Promise<boolean> => {
    const response = await api.delete<Category, ApiResponse<null>>(`/categories/${id}`);
    return response.success;
  },
};
