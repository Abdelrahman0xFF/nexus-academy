import { api, ApiResponse } from "./api-client";

export const paymentApi = {
  createCheckoutSession: async (courseId: number): Promise<ApiResponse<{ url: string }>> => {
    return api.post<{ course_id: number }, ApiResponse<{ url: string }>>("/payments/create-checkout-session", {
      course_id: courseId,
    });
  },
};
