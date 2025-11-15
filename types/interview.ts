// types/interview.ts

/**
 * Mülakatın durumu için enum
 */
export enum InterviewStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DRAFT = "draft",
  INACTIVE = "inactive"
}

/**
 * Mülakat için her bir soru modeli
 */
export interface InterviewQuestion {
  _id?: string;
  questionText: string;
  expectedAnswer: string;
  explanation?: string;
  keywords: string[];
  order: number;
  duration: number;
  aiMetadata: {
    complexityLevel: "low" | "medium" | "high";
    requiredSkills: string[];
    keywordMatchScore?: number;
  };
}

// --- CORE MODELLER ---

/**
 * Mülakat modeli (API'dan gelen veri yapısı)
 */
export interface Interview {
  _id: string; 
  title: string;
  expirationDate: string; // ISO formatlı tarih
  createdBy: {
    userId: string;
  };
  status: InterviewStatus;
  personalityTestId?: string;
  stages: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  interviewLink?: {
    link: string;
    expirationDate?: string; 
  };
  questions: InterviewQuestion[];
  createdAt: string; 
  updatedAt: string;
}

/**
 * Mülakat oluşturma DTO’su (POST /interviews)
 */
export interface CreateInterviewDTO {
  title: string;
  expirationDate: string | Date; // Hem string hem Date kabul et
  personalityTestId?: string;
  stages?: { // Optional yapıldı, backend'de default değer atılıyor
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
}

/**
 * Mülakat güncelleme DTO'su (PUT /interviews/:id)
 * Tüm alanlar optional olmalı.
 */
export interface UpdateInterviewDTO {
  title?: string;
  expirationDate?: string | Date;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
  personalityTestId?: string;
}

// --- STORE ve DİĞER MODELLER ---

/**
 * Mülakat başvurusu modeli
 */
export interface InterviewApplicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

/**
 * Interview Store'un state tipi
 */
export interface InterviewStoreState {
  interviews: Interview[];
  selectedInterview: Interview | null;
  loading: boolean;
  error: string | null;
}

/**
 * Interview Store'un işlemlerini tanımlayan interface
 * Frontend Store'un nihai metot listesini yansıtır.
 */
export interface InterviewStoreActions {
  fetchInterviews: () => Promise<void>;
  getInterviewById: (id: string) => Promise<void>;
  createInterview: (data: CreateInterviewDTO) => Promise<Interview>;
  // 🚨 Güncel tip: Partial<UpdateInterviewDTO> veya UpdateInterviewDTO olabilir
  updateInterview: (id: string, data: Partial<UpdateInterviewDTO>) => Promise<void>;
  // 🚨 Yeni eklenen yayınlama metodu
  publishInterview: (id: string) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
}

