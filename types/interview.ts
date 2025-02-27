// types/interview.ts

/**
 * Mülakat için her bir soru modeli
 */
export interface InterviewQuestion {
  _id?: string; // MongoDB ObjectId uyumlu hale getirildi
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

/**
 * Mülakat modeli
 */
export interface Interview {
  _id: string; // MongoDB ObjectId
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
    expirationDate?: string; // Backend Date olarak tutuyor ama frontend string olarak saklayacak
  };
  questions: InterviewQuestion[];
  createdAt: string; // ISO tarih formatında saklanacak
  updatedAt: string;
}

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
 * Mülakat bildirim modeli
 */
export interface InterviewNotification {
  _id: string;
  userId: string;
  type: "reminder" | "other";
  message: string;
  createdAt: string;
}

/**
 * Mülakat sonucu modeli
 */
export interface InterviewResult {
  _id: string;
  interviewId: string;
  candidateId: string;
  score: number;
  comments: string;
  reviewedBy: string;
  reviewedAt: string;
}

/**
 * Mülakat oluşturma DTO’su
 */
export interface CreateInterviewDTO {
  title: string;
  expirationDate: string; // ISO formatlı tarih
  personalityTestId?: string;
  stages: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
}

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
 * Mülakat güncelleme DTO'su
 */
export interface UpdateInterviewDTO {
  title?: string;
  expirationDate?: string;
  stages?: {
    personalityTest: boolean;
    questionnaire: boolean;
  };
  status?: InterviewStatus;
  questions?: InterviewQuestion[];
  personalityTestId?: string;
}

/**
 * Mülakatın durumunu güncelleme DTO'su
 */
export interface UpdateInterviewStatusDTO {
  newStatus: InterviewStatus;
}

/**
 * Mülakatın sorularını güncelleme DTO'su
 */
export interface UpdateInterviewQuestionsDTO {
  questions: InterviewQuestion[];
}

/**
 * Mülakatın kişilik testini güncelleme DTO'su
 */
export interface UpdatePersonalityTestDTO {
  personalityTestId: string;
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
  createInterview: (data: CreateInterviewDTO) => Promise<void>;
  updateInterview: (id: string, data: UpdateInterviewDTO) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
  updateInterviewStatus: (id: string, newStatus: InterviewStatus) => Promise<void>;
  updateInterviewQuestions: (id: string, questions: InterviewQuestion[]) => Promise<void>;
  updatePersonalityTest: (id: string, personalityTestId: string) => Promise<void>;
}
