import { api } from "./api-client";

export interface Category {
  category_id: number;
  name: string;
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return api.get("/categories");
  },

  create: async (name: string): Promise<Category> => {
    return api.post("/categories", { name });
  },

  update: async (id: number, name: string): Promise<{ message: string }> => {
    return api.put(`/categories/${id}`, { name });
  },

  delete: async (id: number): Promise<boolean> => {
    return api.delete(`/categories/${id}`);
  },
};
