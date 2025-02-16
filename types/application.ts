import type { HRNote, SubmittedDocument } from "./common";

export type ApplicationStatus = "pending" | "in_progress" | "completed" | "rejected" | "accepted";

export interface CandidateProfile {
  name: string;
  surname: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  verificationCode?: string;
  kvkkConsent?: boolean;
  education?: {
    school: string;
    degree: string;
    graduationYear: number;
  }[];
  experience?: {
    company: string;
    position: string;
    duration: string;
    responsibilities: string;
  }[];
  skills?: {
    technical: string[];
    personal: string[];
    languages: string[];
  };
  documents?: {
    resume?: string;
    certificates?: string[];
    socialMediaLinks?: string[];
  };
}

export interface Application {
  id: string;
  interviewId: string;
  candidate: CandidateProfile; // ✅ Backend ile eşleşmesi için `candidate` objesi eklendi.
  status: ApplicationStatus;
  submissionDate: string;
  completionStatus: "not_started" | "in_progress" | "completed" | "expired";
  submittedDocuments: SubmittedDocument[];
  personalityTestResult?: PersonalityTestResult;
  videoInterview?: VideoInterview;
  answers: ApplicationAnswer[];
  aiEvaluation: AIEvaluation;
  generalAIAnalysis?: GeneralAIAnalysis; // ✅ Backend'deki `generalAIAnalysis` eklendi.
  hrNotes: HRNote[];
  allowRetry: boolean; // ✅ Kullanıcının mülakata tekrar katılmasına izin verilip verilmediği
  supportRequests: SupportRequest[]; // ✅ Kullanıcının destek talepleri
  createdAt: string;
  updatedAt: string;
}

export interface GeneralAIAnalysis {
  overallScore?: number;
  technicalSkillsScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  personalityMatchScore?: number;
  strengths?: string[];
  areasForImprovement?: string[];
  recommendation?: string;
}

export interface SupportRequest {
  timestamp: string;
  message: string;
}

export interface VideoInterview {
  submitted: boolean;
  reviewStatus: "not_reviewed" | "in_review" | "approved" | "rejected";
}

export interface ApplicationAnswer {
  questionId: string;
  questionTitle: string;
  answerText: string;
  videoUrl?: string;
  duration?: number;
  aiAnalysis?: AnswerAIAnalysis;
}

export interface AnswerAIAnalysis {
  relevanceScore: number;
  clarityScore: number;
  technicalAccuracyScore: number;
  overallScore: number;
  feedback: string;
}

export interface AIEvaluation {
  overallScore: number;
  technicalSkillsScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  culturalFitScore: number;
  strengths: string[];
  areasForImprovement: string[];
  recommendation: string;
  confidenceScore?: number;
}

export interface PersonalityTestResult {
  completed: boolean;
  score: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  analysis: string;
}
