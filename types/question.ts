export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    expectedAnswer?: string;
    keywords: string[];
    duration: number;
    order: number;
    difficulty?: QuestionDifficulty;
    category?: string;
    aiGenerated?: boolean;
  }
  
  export type QuestionType = "text" | "video" | "multiple_choice";
  
  export type QuestionDifficulty = "easy" | "medium" | "hard";
  
  export interface QuestionAnswer {
    questionId: string;
    questionText: string;
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
  
  export interface AIQuestionSuggestion {
    text: string;
    type: QuestionType;
    expectedAnswer: string;
    keywords: string[];
    difficulty: QuestionDifficulty;
  }
  