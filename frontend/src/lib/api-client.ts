import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:4000/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // With credentials: true, the browser automatically sends HttpOnly cookies.
    // Manual extraction is not needed and doesn't work for HttpOnly cookies.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);
