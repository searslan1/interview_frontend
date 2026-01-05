import { Candidate, CandidateExperience } from './candidate';

// ========================================
// SERVER-SIDE PAGINATION & FILTER TYPES
// ========================================

/**
 * API Query Parametreleri
 * Backend'e gönderilecek sayfalama, filtreleme ve sıralama parametreleri
 */
export interface ApplicationQueryParams {
  page?: number;
  limit?: number;
  interviewId?: string;
  status?: ApplicationStatus | 'all';
  analysisStatus?: 'all' | 'completed' | 'pending'; // ✅ EKLENDİ: Backend Repository bu filtreyi destekliyor
  query?: string;
  aiScoreMin?: number;
  sortBy?: 'createdAt' | 'aiScore' | 'candidateName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Sayfalanmış API Yanıtı
 * Backend'den dönen standart pagination response formatı
 */
export interface PaginatedApplicationResponse {
  success: boolean;
  data: Application[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Store Filter State
 * UI'da kullanılan filtre durumu
 */
export interface ApplicationFilterState {
  interviewId?: string;
  status?: ApplicationStatus | 'all';
  analysisStatus?: 'all' | 'completed' | 'pending'; // ✅ EKLENDİ
  query?: string;
  aiScoreMin?: number;
}

/**
 * Store Sort State
 * UI'da kullanılan sıralama durumu
 */
export interface ApplicationSortState {
  sortBy: 'createdAt' | 'aiScore' | 'candidateName' | 'status';
  sortOrder: 'asc' | 'desc';
}

// ========================================
// APPLICATION MODELS
// ========================================

// ✅ YENİ: Backend Model'deki gömülü yanıta uygun hale getirildi
export interface ApplicationResponse {
  questionId: string;
  videoUrl?: string; // S3/Cloudfront linki
  textAnswer?: string; 
  duration?: number;
}

export interface PersonalityTestScores {
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
}

export interface PersonalityTestResults {
  testId: string;
  completed: boolean;
  scores?: PersonalityTestScores;
  personalityFit?: number;
}

export interface GeneralAIAnalysis {
  overallScore?: number;
  technicalSkillsScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  personalityMatchScore?: number;
  strengths?: string[];
  areasForImprovement?: string[] | { // Backend bazen string[] bazen obje dizisi dönebilir, esnek tutalım
    area: string;
    recommendedAction: string;
  }[];
  recommendation?: string;
  source?: 'aiAnalysis' | 'legacy'; // ✅ EKLENDİ: Backend controller bunu ekliyor
  analyzedAt?: Date; // ✅ EKLENDİ
  improvementAreas: string[]; // ✅ EKLENDİ
}

export interface SupportRequest {
  timestamp: Date;
  message: string;
}

// ✅ GÜNCELLENDİ: Backend Model'deki tüm durumları yansıtacak şekilde genişletildi
export type ApplicationStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'accepted'
  | 'awaiting_video_responses' // Yeni
  | 'awaiting_ai_analysis';     // Yeni

  // ✅ YENİ: UI Durumları (Backend Controller hesaplayıp dönüyor)
export type VideoStatus = 'has_video' | 'no_video';
export type AIStatus = 'no_analysis' | 'pending' | 'completed';

export interface Application {
  id: string;
  _id: string;
  interviewId: string | { _id: string; title: string };
  candidate: Candidate;
  status: ApplicationStatus;
  
  // ✅ DÜZELTME: Backend Model'deki gömülü yanıt dizisi
  responses: ApplicationResponse[]; 
  experience: CandidateExperience[];
  personalityTestResults?: PersonalityTestResults;
  
  // ✅ DÜZELTME: Backend'den gelen AI analiz sonuçlarının ObjectId referans dizisi
  aiAnalysisResults: string[]| any[]; // ObjectId referansları string olarak gelecek
  latestAIAnalysisId?: string;

  videoStatus: VideoStatus;
  aiStatus: AIStatus;
  analysisStatus: 'completed' | 'pending';
  
  generalAIAnalysis?: GeneralAIAnalysis;

  primaryAIAnalysis?: GeneralAIAnalysis;
  
  allowRetry: boolean;
  maxRetryAttempts?: number;
  retryCount?: number;
  supportRequests: SupportRequest[];
  createdAt: string;
  updatedAt: string;
}

// ========================================
// LEGACY TYPES (Geriye Dönük Uyumluluk)
// ========================================

/**
 * @deprecated Use ApplicationFilterState and ApplicationQueryParams instead
 */
export interface ApplicationFilters {
  interviewId: string;
  dateRange?: { from?: Date; to?: Date };
  completionStatus: 'all' | 'completed' | 'inProgress' | 'incomplete';
  applicationStatus: 'all' | 'reviewing' | 'pending' | 'positive' | 'negative';
  experienceLevel: 'all' | 'entry' | 'mid' | 'senior';
  aiScoreMin: number;
  personalityType: string;
  searchTerm: string;
}
