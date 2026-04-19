import { api, ApiResponse } from "./api-client";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "instructor" | "admin";
  avatar_url?: string;
  title?: string;
  bio?: string;
  created_at: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<ApiResponse<User>> => {
    return api.post<AuthCredentials, ApiResponse<User>>("/auth/login", credentials);
  },

  register: async (formData: FormData): Promise<ApiResponse<null>> => {
    return api.post<FormData, ApiResponse<null>>("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  verifyOtp: async (data: { email: string; otp: string }): Promise<ApiResponse<null>> => {
    return api.post<{ email: string; otp: string }, ApiResponse<null>>("/auth/verify-otp", data);
  },

  resendOtp: async (email: string): Promise<ApiResponse<null>> => {
    return api.post<{ email: string }, ApiResponse<null>>("/auth/resend-otp", { email });
  },
  
  me: async (): Promise<ApiResponse<User>> => {
    return api.get<never, ApiResponse<User>>("/auth/me");
  },

  updateProfile: async (userId: number, formData: FormData): Promise<ApiResponse<null>> => {
    return api.put<FormData, ApiResponse<null>>(`/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<null>> => {
    return api.put<ChangePasswordData, ApiResponse<null>>("/auth/change-password", data);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return api.post<never, ApiResponse<null>>("/auth/logout");
  }
};
