import type { PersonalityInventoryResult } from "@/types/personalityInventory"

export const mockPersonalityInventoryResults: PersonalityInventoryResult[] = [
  {
    candidateId: "64f9d2b5d6b4a8e5a7d3c2b1",
    interviewId: "73f8e2c7d5a9b6f4c1d2e3b0",
    inventoryId: 2,
    completedAt: "2024-02-05T14:30:00.000Z",
    questions: [
      {
        questionId: 1,
        questionText: "Takım çalışmasını bireysel çalışmaya tercih ederim.",
        answer: 3,
      },
      {
        questionId: 2,
        questionText: "Yeni insanlarla tanışmak ve iletişim kurmak benim için kolaydır.",
        answer: 4,
      },
      {
        questionId: 3,
        questionText: "Zor kararlar alırken duygularımdan çok mantığımı kullanırım.",
        answer: 2,
      },
      {
        questionId: 4,
        questionText: "Detaylara çok dikkat ederim ve planlı çalışırım.",
        answer: 5,
      },
      {
        questionId: 5,
        questionText: "Baskı altında çalışmak beni motive eder.",
        answer: 1,
      },
    ],
    analysis: {
      teamwork: 3,
      communication: 4,
      decisionMaking: 2,
      attentionToDetail: 5,
      stressManagement: 1,
      overallAssessment:
        "Aday, detaylara önem veren ve iyi iletişim kurabilen bir profil sergiliyor. Ancak, stres yönetimi ve karar verme süreçlerinde gelişim alanları mevcut.",
    },
  },
  {
    candidateId: "64f9d2b5d6b4a8e5a7d3c2b2",
    interviewId: "73f8e2c7d5a9b6f4c1d2e3b1",
    inventoryId: 2,
    completedAt: "2024-02-06T10:15:00.000Z",
    questions: [
      {
        questionId: 1,
        questionText: "Takım çalışmasını bireysel çalışmaya tercih ederim.",
        answer: 4,
      },
      {
        questionId: 2,
        questionText: "Yeni insanlarla tanışmak ve iletişim kurmak benim için kolaydır.",
        answer: 5,
      },
      {
        questionId: 3,
        questionText: "Zor kararlar alırken duygularımdan çok mantığımı kullanırım.",
        answer: 3,
      },
      {
        questionId: 4,
        questionText: "Detaylara çok dikkat ederim ve planlı çalışırım.",
        answer: 4,
      },
      {
        questionId: 5,
        questionText: "Baskı altında çalışmak beni motive eder.",
        answer: 3,
      },
    ],
    analysis: {
      teamwork: 4,
      communication: 5,
      decisionMaking: 3,
      attentionToDetail: 4,
      stressManagement: 3,
      overallAssessment:
        "Aday, güçlü iletişim becerileri ve takım çalışmasına yatkınlık gösteriyor. Stres yönetimi ve karar verme konularında ortalama bir performans sergiliyor.",
    },
  },
]

