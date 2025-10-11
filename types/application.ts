import { Candidate, CandidateExperience } from './candidate';

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
  areasForImprovement?: {
    area: string;
    recommendedAction: string;
  }[];
  recommendation?: string;
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

export interface Application {
  id: string;
  _id: string;
  interviewId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  
  // ✅ DÜZELTME: Backend Model'deki gömülü yanıt dizisi
  responses: ApplicationResponse[]; 
  experience: CandidateExperience[];
  personalityTestResults?: PersonalityTestResults;
  
  // ✅ DÜZELTME: Backend'den gelen AI analiz sonuçlarının ObjectId referans dizisi
  aiAnalysisResults: string[]; // ObjectId referansları string olarak gelecek
  latestAIAnalysisId?: string;
  
  generalAIAnalysis?: GeneralAIAnalysis;
  allowRetry: boolean;
  maxRetryAttempts?: number;
  retryCount?: number;
  supportRequests: SupportRequest[];
  createdAt: string;
  updatedAt: string;
}

// ApplicationFilters tipi (Mevcut haliyle kaldı)
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
