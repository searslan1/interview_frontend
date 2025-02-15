export const mockReportingData = {
  generalStatistics: {
    totalInterviews: 1234,
    totalApplications: 5678,
    averageCandidateScore: 78,
    popularInterviews: [
      { id: 1, name: "Yazılım Geliştirici", applications: 234 },
      { id: 2, name: "Ürün Yöneticisi", applications: 189 },
      { id: 3, name: "Veri Bilimci", applications: 156 },
    ],
  },
  candidateAnalysis: {
    averageInterviewScore: 82,
    gestureAnalysis: {
      confidence: 75,
      stress: 30,
      eyeContact: 85,
    },
    emotionAnalysis: [
      { name: "Başlangıç", positive: 60, neutral: 30, negative: 10 },
      { name: "Orta", positive: 70, neutral: 20, negative: 10 },
      { name: "Son", positive: 80, neutral: 15, negative: 5 },
    ],
    speechAnalysis: {
      confidence: 78,
      fluency: 85,
      clarity: 80,
    },
  },
  interviewQualityAnalysis: {
    interviewSuccessRate: 78,
    durationVsSuccess: [
      { duration: "0-15 dk", successRate: 65 },
      { duration: "15-30 dk", successRate: 75 },
      { duration: "30-45 dk", successRate: 80 },
      { duration: "45+ dk", successRate: 72 },
    ],
    interviewTypeSuccess: [
      { type: "Teknik", successRate: 82 },
      { type: "Davranışsal", successRate: 75 },
      { type: "Soft Skills", successRate: 88 },
    ],
    bestPerformingInterviews: [
      { name: "Yazılım Geliştirici", score: 85 },
      { name: "Ürün Yöneticisi", score: 82 },
      { name: "Veri Bilimci", score: 80 },
    ],
  },
  aiRecommendations: {
    topCandidates: [
      { id: 1, name: "John Doe", score: 92 },
      { id: 2, name: "Jane Smith", score: 89 },
      { id: 3, name: "Bob Johnson", score: 87 },
    ],
    processImprovements: [
      "Teknik mülakat sorularını güncelleyin",
      "Mülakat süresini 45 dakikaya çıkarın",
      "Soft skills değerlendirmesine daha fazla ağırlık verin",
    ],
    candidateRecommendations: [
      {
        candidateId: 4,
        name: "Alice Brown",
        currentInterview: "Yazılım Geliştirici",
        recommendedInterview: "Veri Bilimci",
      },
      {
        candidateId: 5,
        name: "Charlie Davis",
        currentInterview: "Ürün Yöneticisi",
        recommendedInterview: "UX Tasarımcısı",
      },
    ],
    hiringPredictions: [
      { candidateId: 1, name: "John Doe", probability: 85 },
      { candidateId: 2, name: "Jane Smith", probability: 78 },
    ],
  },
  visualizationsData: {
    applicationTrends: [
      { month: "Ocak", applications: 120 },
      { month: "Şubat", applications: 150 },
      { month: "Mart", applications: 200 },
      { month: "Nisan", applications: 180 },
      { month: "Mayıs", applications: 220 },
      { month: "Haziran", applications: 250 },
    ],
    candidateLocationHeatmap: [
      { name: "İstanbul", value: 400 },
      { name: "Ankara", value: 300 },
      { name: "İzmir", value: 200 },
      { name: "Bursa", value: 100 },
      { name: "Antalya", value: 80 },
    ],
    gestureAnalysisTrends: [
      { month: "Ocak", confidence: 70, stress: 30, eyeContact: 80 },
      { month: "Şubat", confidence: 75, stress: 28, eyeContact: 82 },
      { month: "Mart", confidence: 78, stress: 25, eyeContact: 85 },
      { month: "Nisan", confidence: 80, stress: 22, eyeContact: 88 },
      { month: "Mayıs", confidence: 82, stress: 20, eyeContact: 90 },
      { month: "Haziran", confidence: 85, stress: 18, eyeContact: 92 },
    ],
    technicalKnowledgeDistribution: [
      { name: "Başlangıç", value: 20 },
      { name: "Orta", value: 40 },
      { name: "İleri", value: 30 },
      { name: "Uzman", value: 10 },
    ],
  },
}

