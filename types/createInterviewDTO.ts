import * as z from "zod";
import { InterviewStatus } from "./interview";

export const createInterviewSchema = z.object({
  title: z.string().min(2, "Mülakat adı en az 2 karakter olmalıdır."),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  expirationDate: z.string(), // ✅ ISO format uyumlu
  personalityTestId: z.string().optional(),
  status: z.nativeEnum(InterviewStatus).default(InterviewStatus.DRAFT),
  stages: z.object({
    personalityTest: z.boolean().default(false),
    questionnaire: z.boolean().default(true),
  }),
  questions: z.array(
    z.object({
      _id: z.string().optional(), // ✅ Opsiyonel hale getirildi
      questionText: z.string(),
      expectedAnswer: z.string().default(""), // ✅ Varsayılan boş string verildi
      explanation: z.string().optional(),
      keywords: z.array(z.string()),
      order: z.number(),
      duration: z.number(),
      aiMetadata: z.object({
        complexityLevel: z.enum(["low", "medium", "high"]),
        requiredSkills: z.array(z.string()),
        keywordMatchScore: z.number().optional(),
      }),
    })
  ),
});

export type CreateInterviewDTO = z.infer<typeof createInterviewSchema>;
