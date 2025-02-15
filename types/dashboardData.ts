export interface DashboardData {
  totalApplications: number
  totalInterviews: number
  averageCandidateScore: number
  applicationTrends: { date: string; count: number }[]
  departmentApplications: { department: string; count: number }[]
  topPerformingInterviews: { id: string; title: string; averageScore: number }[]
  recentActivities: { id: string; type: string; description: string; timestamp: Date }[]
}

export interface FavoriteCandidate {
  id: number
  name: string
  position: string
  score: number
}

