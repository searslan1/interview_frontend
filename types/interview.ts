export type InterviewStatus = "active" | "completed" | "published" | "draft" | "inactive";

export interface Interview {
  id: string;
  title: string;
  expirationDate: Date;
  createdBy: {
    userId: string;
  };
  status: InterviewStatus;
  personalityTestId?: string; // Kişilik testiyle bağlantılıysa
  stages: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  interviewLink: {
    link: string;
    expirationDate?: Date;
  };
  questions: InterviewQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestion {
  id: string;
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

export interface InterviewApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
}

export interface InterviewNotification {
  type: "reminder" | "other";
  message: string;
  createdAt: Date;
}

export interface InterviewResult {
  candidateId: string;
  score: number;
  comments: string;
  reviewedBy: string;
  reviewedAt: Date;
}
