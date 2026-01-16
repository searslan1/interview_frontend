import * as z from "zod";
import { InterviewStatus } from "./interview";

// Mülakat tipi kaldırıldı - kullanılmıyor

// ✅ Pozisyon Bilgileri Şeması
export const positionSchema = z.object({
  title: z.string().min(2, "Pozisyon adı en az 2 karakter olmalıdır.").max(100),
  department: z.string().optional().or(z.literal("")),
  competencyWeights: z.object({
    technical: z.number().min(0).max(100).optional(),
    communication: z.number().min(0).max(100).optional(),
    problem_solving: z.number().min(0).max(100).optional(),
  }).optional(),
  description: z.string().optional().or(z.literal("")),
});

// ✅ EKLENDİ: AI Analiz Ayarları Şeması (Frontend Formu İçin)
export const aiAnalysisSettingsSchema = z.object({
  useAutomaticScoring: z.boolean().default(true),
  gestureAnalysis: z.boolean().default(true),
  speechAnalysis: z.boolean().default(true),
  eyeContactAnalysis: z.boolean().default(false),
  tonalAnalysis: z.boolean().default(false),
  keywordMatchScore: z.number().min(0).default(0),
});

// ✅ Soru AI Metadata Şeması
export const aiMetadataSchema = z.object({
  // Backend ile eşitlendi: 5 Seviye
  complexityLevel: z.enum(["low", "medium", "high", "intermediate", "advanced"]), 
  requiredSkills: z.array(z.string()).min(1, "En az bir yetenek eklenmelidir."),
  keywordMatchScore: z.number().optional(),
});

// ✅ Soru Şeması
export const questionSchema = z.object({
  _id: z.string().optional(),
  questionText: z.string().min(1, "Soru metni zorunludur."),
  expectedAnswer: z.string().default(""), // Backend required bekliyor, formda default boş string
  explanation: z.string().optional().or(z.literal("")),
  keywords: z.array(z.string()).min(1, "En az bir anahtar kelime girilmelidir."),
  order: z.number(),
  duration: z.number().min(10, "Süre en az 10 saniye olmalıdır."),
  aiMetadata: aiMetadataSchema,
});

// ✅ Ana Mülakat Oluşturma Şeması
export const createInterviewSchema = z.object({
  // Temel Bilgiler
  title: z.string()
    .min(5, "Mülakat adı en az 5 karakter olmalıdır.")
    .max(100, "Mülakat adı en fazla 100 karakter olabilir."),
  description: z.string().optional().or(z.literal("")),
  // Zod string bekler, backend'e gönderirken Date objesine çevrilir veya ISO string gider
  expirationDate: z.string().or(z.date()), 

  // Pozisyon Bilgileri
  position: positionSchema.optional(),

  // ✅ EKLENDİ: AI Analiz Ayarları
  aiAnalysisSettings: aiAnalysisSettingsSchema.optional(),

  // Mevcut Alanlar
  personalityTestId: z.string().optional().or(z.literal("")),
  // Enum validasyonu
  status: z.nativeEnum(InterviewStatus).default(InterviewStatus.DRAFT),
  stages: z.object({
    personalityTest: z.boolean().default(false),
    questionnaire: z.boolean().default(true),
  }).default({ personalityTest: false, questionnaire: true }),

  // Sorular
  questions: z.array(questionSchema).default([]),
});

// Typescript Tiplerini Zod'dan Türetme
export type CreateInterviewDTO = z.infer<typeof createInterviewSchema>;
export type InterviewPosition = z.infer<typeof positionSchema>;
export type InterviewQuestionDTO = z.infer<typeof questionSchema>;
// Yeni tip
export type AiAnalysisSettingsDTO = z.infer<typeof aiAnalysisSettingsSchema>;