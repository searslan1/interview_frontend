// services/publicApplicationService.ts

import axios from "axios";
import { getSessionToken } from "@/store/usePublicApplicationStore";

// --- Types ---
export interface PublicInterviewData {
  interviewId: string;
  title: string;
  description?: string;
  stages: any[];
  status: string;
  expirationDate?: string;
  questions: {
    _id: string;
    questionText: string;
    order: number;
    duration: number;
  }[];
}

export interface StartApplicationDTO {
  interviewId: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  kvkkConsent: boolean;
}

export interface VerifyOtpDTO {
  applicationId: string;
  otpCode: string;
}

export interface UpdateProfileDTO {
  education?: any[];
  experience?: any[];
  skills?: { technical?: string[]; personal?: string[]; languages?: string[] };
  documents?: {
    resume?: string;
    certificates?: string[];
    socialMediaLinks?: string[];
  };
}

export interface VideoResponseSubmission {
  questionId: string;
  videoUrl: string;
  duration: number;
  textAnswer?: string;
}

// ✅ BASE URL: utils/api dosyanızdaki mantığı baz aldık
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000/api";

// ✅ CANDIDATE API INSTANCE
// Admin interceptor'larından etkilenmemesi için izole bir instance oluşturuyoruz.
const candidateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR: Token'ı otomatik ekle
candidateApi.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Service Methods ---

export const getInterviewInfo = async (
  interviewId: string
): Promise<PublicInterviewData> => {
  const response = await candidateApi.get(`/public/interviews/${interviewId}`);
  return response.data.data;
};

export const startApplication = async (data: StartApplicationDTO) => {
  const response = await candidateApi.post(
    `/public/interviews/${data.interviewId}/apply`,
    data
  );
  return response.data.data;
};

export const verifyOtp = async (data: VerifyOtpDTO) => {
  const response = await candidateApi.post(
    `/public/applications/verify-otp`,
    data
  );
  return response.data.data;
};

export const resendOtp = async (applicationId: string) => {
  const response = await candidateApi.post(`/public/applications/resend-otp`, {
    applicationId,
  });
  return response.data;
};

export const getMyApplication = async () => {
  const response = await candidateApi.get(`/public/applications/session`);
  return response.data.data;
};

export const updateProfile = async (data: UpdateProfileDTO) => {
  const response = await candidateApi.put(`/public/applications/profile`, data);
  return response.data.data;
};

/**
 * 6. Dosya Yükleme (GÜNCELLENDİ: Mock Bypass Eklendi)
 */
export const uploadFile = async (
  file: File,
  type: "cv" | "certificate" | "video"
): Promise<{ fileKey: string; url: string }> => {
  let mimeType = file.type;
  if (!mimeType) {
    if (type === "cv") mimeType = "application/pdf";
    else if (type === "video") mimeType = "video/webm";
  }

  // 1. Upload URL Al (candidateApi kullanır, Token gider)
  const params = { fileType: mimeType, fileName: file.name };
  const presignResponse = await candidateApi.get(`/public/upload-url`, {
    params,
  });
  const { uploadUrl, fileKey } = presignResponse.data.data;

  // 🚨 MOCK BYPASS (GELİŞTİRME ORTAMI İÇİN)
  // Eğer Backend mock URL dönüyorsa, gerçek upload işlemini atla.
  if (uploadUrl.includes("mock-s3-upload-url")) {
    console.warn(
      "⚠️ MOCK URL Tespit Edildi: Gerçek dosya yükleme işlemi atlanıyor."
    );

    // Gerçekçilik için 1 saniye bekle
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { fileKey, url: uploadUrl };
  }

  // 2. Dosyayı S3'e yükle (Saf axios kullanır, Token GİTMEZ)
  // Sadece gerçek bir URL varsa burası çalışır
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": mimeType },
  });

  return { fileKey, url: uploadUrl.split("?")[0] };
};

/**
 * 7. Video Upload URL Al
 */
export const getVideoUploadUrl = async (
  questionId: string,
  contentType: string
) => {
  const response = await candidateApi.get(`/public/video/upload-url`, {
    params: { questionId, contentType },
  });
  return response.data.data;
};

export const submitVideoResponse = async (data: VideoResponseSubmission) => {
  const response = await candidateApi.post(`/public/video/response`, data);
  return response.data.data;
};

export const submitPersonalityTest = async (testId: string, answers: any) => {
  const response = await candidateApi.post(
    `/public/personality-test/response`,
    { testId, answers }
  );
  return response.data.data;
};

const publicApplicationService = {
  getInterviewInfo,
  startApplication,
  verifyOtp,
  resendOtp,
  getMyApplication,
  updateProfile,
  uploadFile,
  getVideoUploadUrl,
  submitVideoResponse,
  submitPersonalityTest,
};

export default publicApplicationService;
