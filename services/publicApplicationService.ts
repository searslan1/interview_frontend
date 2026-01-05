// src/services/publicApplicationService.ts

import api from "@/utils/api"; // Axios instance
import axios from "axios"; // S3 upload için ham axios (interceptor'sız)

// --- Types ---
// (İdeal dünyada bunlar types klasöründen gelir ama pratiklik için buraya özetliyorum)

export interface PublicInterviewData {
  interviewId: string;
  title: string;
  description?: string;
  stages: any[];
  status: string;
  expirationDate?: string;
  questions: {
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
  skills?: {
    technical?: string[];
    personal?: string[];
    languages?: string[];
  };
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
  textAnswer?: string; // Opsiyonel (transkript vb.)
}

// --- Service ---

/**
 * 1. Mülakat Bilgilerini Getir (Landing)
 */
export const getInterviewInfo = async (interviewId: string): Promise<PublicInterviewData> => {
  const response = await api.get(`/public/interview/${interviewId}`);
  return response.data.data;
};

/**
 * 2. Başvuru Başlat (Auth Adım 1)
 */
export const startApplication = async (data: StartApplicationDTO) => {
  const response = await api.post(`/public`, data);
  return response.data.data; // { applicationId, status, phoneVerified }
};

/**
 * 3. OTP Doğrula (Auth Adım 2) -> Token Döner
 */
export const verifyOtp = async (data: VerifyOtpDTO) => {
  const response = await api.post(`/public/verifyOtp`, data);
  return response.data.data; // { token, application }
};

/**
 * 3.1 OTP Tekrar Gönder
 */
export const resendOtp = async (applicationId: string) => {
  const response = await api.post(`/public/resendOtp`, { applicationId });
  return response.data;
};

/**
 * 4. Mevcut Başvuruyu Getir (F5 Desteği / Resume)
 * Token header'da otomatik gider (api interceptor sayesinde)
 */
export const getMyApplication = async () => {
  const response = await api.get(`/public/me`);
  return response.data.data;
};

/**
 * 5. Profil Güncelle (Wizard)
 */
export const updateProfile = async (data: UpdateProfileDTO) => {
  const response = await api.put(`/public/update`, data);
  return response.data.data;
};

/**
 * 6. Dosya Yükleme Helper'ı (CV, Sertifika)
 * Önce Backend'den URL alır, sonra S3'e yükler.
 */
export const uploadFile = async (
  file: File, 
  type: 'cv' | 'certificate' | 'video'
): Promise<{ fileKey: string; url: string }> => {
  
  // A. Backend'den Upload URL al
  // type mapping: cv -> application/pdf, video -> video/webm vb.
  let mimeType = file.type;
  if (!mimeType) {
      if (type === 'cv') mimeType = 'application/pdf';
      else if (type === 'video') mimeType = 'video/webm';
  }

  // Endpoint seçimi (Video için ayrı, döküman için ayrı endpoint yapmıştık ama mantık aynı)
  // Backend'de: getUploadUrl ve getVideoUploadUrl var.
  // Video için getVideoUploadUrl, diğerleri için getUploadUrl kullanalım.
  
  let endpoint = '/public/upload-url';
  let params: any = { fileType: mimeType, fileName: file.name };

  // Video özel durumu (QuestionId gerekebilir ama generic upload için gerekmiyor şu an)
  // Backend getVideoUploadUrl questionId istiyor. Eğer sınav anındaysak onu kullanırız.
  // Bu fonksiyon genel dosya yükleme için.
  
  const presignResponse = await api.get(endpoint, { params });
  const { uploadUrl, fileKey } = presignResponse.data.data;

  // B. Dosyayı S3'e (veya Mock URL'e) yükle
  // NOT: Burada 'api' instance'ı yerine ham 'axios' kullanıyoruz çünkü
  // Authorization header'ı S3 isteğine gitmemeli (CORS hatası verir).
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': mimeType,
    },
  });

  return { fileKey, url: uploadUrl.split('?')[0] }; // Query params'sız temiz URL (opsiyonel)
};

/**
 * 7. Video Upload URL Al (Sınav İçin Özel)
 */
export const getVideoUploadUrl = async (questionId: string, contentType: string) => {
    const response = await api.get('/public/video/upload-url', {
        params: { questionId, contentType }
    });
    return response.data.data; // { uploadUrl, videoKey }
};

/**
 * 8. Video Yanıtını Kaydet (Backend'e Bildir)
 */
export const submitVideoResponse = async (data: VideoResponseSubmission) => {
  const response = await api.post(`/public/video/response`, data);
  return response.data.data;
};

/**
 * 9. Kişilik Testi Yanıtı
 */
export const submitPersonalityTest = async (testId: string, answers: any) => {
    const response = await api.post(`/public/personality-test/response`, { testId, answers });
    return response.data.data;
}

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
  submitPersonalityTest
};

export default publicApplicationService;