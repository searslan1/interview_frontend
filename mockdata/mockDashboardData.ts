import type { DashboardData } from "@/types/dashboardData"

export const mockDashboardData: DashboardData = {
  totalApplications: 1234,
  totalInterviews: 56,
  averageCandidateScore: 78,
  applicationTrends: [
    { date: "2023-06-01", count: 50 },
    { date: "2023-06-08", count: 65 },
    { date: "2023-06-15", count: 80 },
    { date: "2023-06-22", count: 75 },
    { date: "2023-06-29", count: 90 },
  ],
  departmentApplications: [
    { department: "Yazılım Geliştirme", count: 500 },
    { department: "Ürün Yönetimi", count: 300 },
    { department: "Tasarım", count: 200 },
    { department: "Pazarlama", count: 150 },
    { department: "İnsan Kaynakları", count: 84 },
  ],
  topPerformingInterviews: [
    { id: "int-001", title: "Senior Frontend Developer Mülakatı", averageScore: 85 },
    { id: "int-002", title: "Product Manager Davranışsal Mülakat", averageScore: 82 },
  ],
  recentActivities: [
    {
      id: "act-001",
      type: "new_application",
      description: "Yeni başvuru alındı: Senior Frontend Developer",
      timestamp: new Date("2023-07-02T10:30:00"),
    },
    {
      id: "act-002",
      type: "interview_completed",
      description: "Mülakat tamamlandı: Product Manager pozisyonu",
      timestamp: new Date("2023-07-01T15:45:00"),
    },
  ],
}

