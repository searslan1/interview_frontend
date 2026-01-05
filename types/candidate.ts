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
// MAIN MODELS
// ==========================================

export interface Candidate {
  _id: string;
  
  name: string;
  surname: string;
  fullName: string;
  primaryEmail: string;
  emailAliases?: EmailAlias[];
  phone?: string;
  
  status: CandidateStatus;
  isFavorite: boolean;
  favoritedAt?: string;
  
  scoreSummary: CandidateScoreSummary;
  
  lastInterviewDate?: string;
  firstInterviewDate?: string;
  lastInterviewTitle?: string;
  
  notes?: CandidateNote[];
  notesCount?: number;
  
  createdAt: string;
  updatedAt: string;
  
  mergedInto?: string;
  
  // Frontend uyumluluğu için opsiyonel (bazen UI email diye arayabilir)
  email?: string; 
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