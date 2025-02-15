export interface Application {
  id: string
  candidateName: string
  email: string
  interviewId: string
  interviewTitle: string
  status: string
  submissionDate: string
  aiScore: number
}

export const generateMockApplications = (count: number): Application[] => {
  const statuses = ["Beklemede", "İnceleniyor", "Olumlu", "Olumsuz"]
  const interviewTitles = [
    "Frontend Developer Mülakatı",
    "Backend Developer Mülakatı",
    "UX Designer Mülakatı",
    "Product Manager Mülakatı",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `app-${i + 1}`,
    candidateName: `Aday ${i + 1}`,
    email: `aday${i + 1}@example.com`,
    interviewId: `int-${Math.floor(Math.random() * 4) + 1}`,
    interviewTitle: interviewTitles[Math.floor(Math.random() * interviewTitles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    submissionDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
    aiScore: Math.floor(Math.random() * 100),
  }))
}

export const mockApplications = generateMockApplications(1000)

