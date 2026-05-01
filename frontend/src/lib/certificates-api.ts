import { api, ApiResponse } from "./api-client";

export interface Certificate {
  certificate_id: string;
  user_id: number;
  course_id: number;
  issue_date: string;
  course_name: string;
  inst_first: string;
  inst_last: string;
  download_url: string;
}

export const certificatesApi = {
  getMyCertificates: async (): Promise<ApiResponse<Certificate[]>> => {
    return api.get<never, ApiResponse<Certificate[]>>("/certificates");
  },

  getCertificateHtml: async (courseId: number): Promise<string> => {
    return api.get<never, string>(`/certificates/${courseId}`, {
      responseType: "text" as any,
    });
  },

  verifyCertificate: async (certificateId: string): Promise<string> => {
    return api.get<never, string>(`/certificates/verify/${certificateId}`, {
      responseType: "text" as any,
    });
  },

  getDownloadUrl: (courseId: number): string => {
    return `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/certificates/download/${courseId}`;
  },
};
