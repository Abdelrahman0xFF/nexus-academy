import { get } from "http";
import { api, ApiResponse } from "./api-client";

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "instructor" | "user";
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}
export interface BestInstructor {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  average_rating: number;
}

export const usersApi = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<UsersResponse> => {
    const response = await api.get<any, ApiResponse<UsersResponse>>("/users", { params });
    return response.data;
  },

  getBestInstructors: async (): Promise<BestInstructor[]> => {
    const response = await api.get<any, ApiResponse<{ instructors: BestInstructor[] }>>("/users/best-instructors");
    return response.data.instructors;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<any, ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<any, ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete<any, ApiResponse<null>>(`/users/${id}`);
  },
};
