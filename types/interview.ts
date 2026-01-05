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
 * Mülakat tipi
 */
export type InterviewType = "async-video" | "live-video" | "audio-only" | "text-based";

/**
 * AI Analiz Ayarları (Backend ile eşitlendi)
 */
export interface AiAnalysisSettings {
  useAutomaticScoring: boolean;
  gestureAnalysis: boolean;
  speechAnalysis: boolean;
  eyeContactAnalysis: boolean;
  tonalAnalysis: boolean;
  keywordMatchScore: number;
}

/**
 * Pozisyon yetkinlik ağırlıkları
 */
export interface CompetencyWeights {
  technical?: number;
  communication?: number;
  problem_solving?: number;
}

/**
 * Pozisyon bilgileri
 */
export interface InterviewPosition {
  title: string;
  department?: string;
  competencyWeights?: CompetencyWeights;
  description?: string;
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
    complexityLevel: "low" | "medium" | "high" | "intermediate" | "advanced";
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
  description?: string;
  expirationDate: string; // Backend'den JSON string gelir
  type?: InterviewType;
  position?: InterviewPosition;
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
  
  // ✅ EKLENDİ: AI Analiz Ayarları
  aiAnalysisSettings?: AiAnalysisSettings;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Mülakat oluşturma DTO'su (POST /interviews)
 */
export interface CreateInterviewDTO {
  title: string;
  description?: string;
  expirationDate: string | Date;
  type?: InterviewType;
  position?: InterviewPosition;
  personalityTestId?: string;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
  
  // ✅ EKLENDİ: AI Ayarları Oluştururken
  aiAnalysisSettings?: AiAnalysisSettings;
}

/**
 * Mülakat güncelleme DTO'su (PUT /interviews/:id)
 */
export interface UpdateInterviewDTO {
  title?: string;
  description?: string;
  expirationDate?: string | Date;
  type?: InterviewType;
  position?: InterviewPosition;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
  personalityTestId?: string;

  // ✅ EKLENDİ: AI Ayarları Güncellerken
  aiAnalysisSettings?: AiAnalysisSettings;
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
 */
export interface InterviewStoreActions {
  fetchInterviews: () => Promise<void>;
  getInterviewById: (id: string) => Promise<void>;
  createInterview: (data: CreateInterviewDTO) => Promise<Interview>;
  updateInterview: (id: string, data: Partial<UpdateInterviewDTO>) => Promise<void>;
  publishInterview: (id: string) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
  updateInterviewLink: (id: string, data: { expirationDate: string }) => Promise<string>;
}