export interface PersonalityInventoryResult {
  candidateId: string
  interviewId: string
  inventoryId: number
  completedAt: string
  questions: PersonalityInventoryQuestion[]
  analysis: PersonalityAnalysis
}

export interface PersonalityInventoryQuestion {
  questionId: number
  questionText: string
  answer: number
}

export interface PersonalityAnalysis {
  teamwork: number
  communication: number
  decisionMaking: number
  attentionToDetail: number
  stressManagement: number
  overallAssessment: string
}

