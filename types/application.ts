import { Candidate } from './candidate';

export interface ApplicationResponse {
  questionId: string;
  textAnswer?: string;
  videoAnswerUrl?: string; 
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

export type ApplicationStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'accepted';

export interface Application {
  _id: string;
  interviewId: string;
  candidate: Candidate;
  status: ApplicationStatus;
  personalityTestResults?: PersonalityTestResults;
  responses: ApplicationResponse[];
  aiAnalysisResults: string[];
  latestAIAnalysisId?: string;
  generalAIAnalysis?: GeneralAIAnalysis;
  allowRetry: boolean;
  maxRetryAttempts?: number;
  retryCount?: number;
  supportRequests: SupportRequest[];
  createdAt: string;
  updatedAt: string;
}
// ApplicationFilters tipi
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
