// src/types/candidate.ts

// ==========================================
// ENUMS & BASIC TYPES
// ==========================================

export type CandidateStatus = 
  | "active" 
  | "reviewed" 
  | "shortlisted" 
  | "archived" 
  | "rejected";

export type CandidateSortBy = 'lastInterview' | 'score' | 'createdAt' | 'name';
export type CandidateSortOrder = 'asc' | 'desc';

/**
 * Backend'den gelen alias yapısı
 */
export interface EmailAlias {
    email: string;
    mergedFrom?: string;
    mergedAt?: string;
}

/**
 * Pozisyon Seçenekleri (Filtreleme için)
 */
export interface PositionOption {
    _id: string;
    title: string;
    candidateCount: number;
}

// ==========================================
// SCORE SUMMARIES
// ==========================================

export interface CandidateScoreSummary {
  avgOverallScore?: number;
  avgTechnicalScore?: number;
  avgCommunicationScore?: number;
  avgProblemSolvingScore?: number;
  avgPersonalityScore?: number;
  lastScore?: number;
  lastScoreDate?: string;
  totalInterviews: number;
  completedInterviews: number;
}

// ==========================================
// NOTES & HISTORY
// ==========================================

export interface CandidateNote {
  _id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CandidateInterviewHistoryItem {
    applicationId: string;
    interviewId: string;
    interviewTitle: string;
    positionName?: string;
    department?: string;
    status: string;
    appliedAt: string;
    completedAt?: string;
    scores?: {
        overallScore?: number;
        technicalScore?: number;
        communicationScore?: number;
    };
}
// ==========================================
// RESUME DATA (CV) - YENİ EKLENDİ
// ==========================================

/**
 * İş Deneyimi - Backend: { company, position, duration, responsibilities }
 */
export interface CandidateExperience {
  _id?: string;
  company: string;
  position: string; // Backend'de position
  duration?: string; // Backend'de duration (string format)
  responsibilities?: string;
  // Frontend tarafında kullanılan ama backend'de olmayan alanlar (opsiyonel)
  startDate?: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
  description?: string; // responsibilities ile aynı
}

/**
 * Eğitim Bilgisi - Backend: { school, degree, graduationYear }
 */
export interface CandidateEducation {
  _id?: string;
  school: string;
  degree: string; // Lisans, Yüksek Lisans vb.
  graduationYear?: number; // Backend'de number
  // Frontend tarafında kullanılan ama backend'de olmayan alanlar (opsiyonel)
  department?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isCurrent?: boolean;
}

export interface CandidateSkill {
  name: string;
  level?: number; // 1-10 veya 1-5
}

// ==========================================
// MAIN MODELS (GÜNCEL)
// ==========================================
// ==========================================
// MAIN MODELS
// ==========================================

/**
 * Aday Profili - Backend'den Application üzerinden türetilir
 * 
 * Backend'de aday bilgileri application.candidate içinde tutuluyor:
 * - candidate: { name, surname, email, phone, phoneVerified }
 * - education: [{ school, degree, graduationYear }]
 * - experience: [{ company, position, duration, responsibilities }]
 * - skills: { technical: [], personal: [], languages: [] }
 * - hrNotes: [{ authorId, authorName, content, createdAt, isPrivate }]
 * - hrRating: number (1-5)
 * - favoritedBy: ObjectId[]
 */
export interface Candidate {
  _id: string;
  id?: string; // Geriye uyumluluk
  
  // Temel Bilgiler (application.candidate'den)
  name: string;
  surname: string;
  fullName: string;
  primaryEmail: string;
  email?: string; // Geriye uyumluluk
  emailAliases?: EmailAlias[];
  phone?: string;
  
  // Durum
  status: CandidateStatus;
  isFavorite: boolean;
  favoritedAt?: string;
  
  // Skorlar (AI analiz sonuçlarından)
  scoreSummary: CandidateScoreSummary;
  
  // CV Verileri (application'dan direkt)
  experience: CandidateExperience[];
  education: CandidateEducation[];
  skills: string[] | CandidateSkill[]; // Backend: { technical, personal, languages }
  
  // Mülakat Bilgileri
  lastInterviewDate?: string;
  firstInterviewDate?: string;
  lastInterviewTitle?: string;
  
  // Notlar (application.hrNotes'dan)
  notes?: CandidateNote[];
  notesCount?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Diğer
  mergedInto?: string; // Gelecekte kullanılabilir
}

// ==========================================
// API REQUEST/RESPONSE TYPES
// ==========================================

export interface CandidateListResponse {
    success: boolean;
    data: Candidate[];
    pagination: {
        page: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export interface CandidateFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  
  positionIds?: string[];
  interviewIds?: string[];
  
  status?: CandidateStatus[];
  onlyFavorites?: boolean;
  
  minOverallScore?: number;
  maxOverallScore?: number;
  minTechnicalScore?: number;
  minCommunicationScore?: number;
  
  minInterviewCount?: number;
  maxInterviewCount?: number;
  
  lastInterviewAfter?: Date;
  lastInterviewBefore?: Date;
  
  sortBy?: CandidateSortBy;     // ✅ Artık export edilen tipi kullanıyor
  sortOrder?: CandidateSortOrder; // ✅ Artık export edilen tipi kullanıyor
}

export interface MergeCandidatesDTO {
    targetCandidateId: string;
}

export interface AddNoteDTO {
    content: string;
}

export interface UpdateStatusDTO {
    status: CandidateStatus;
}