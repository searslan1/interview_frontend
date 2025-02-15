"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AIRecommendationsProps {
  filters: {
    dateRange: string
    interviewId: string
    candidateScoreMin: number
    experienceLevel: string
    analysisType: string
  }
}

export function AIRecommendations({ filters }: AIRecommendationsProps) {
  // Bu veriler normalde API'den gelecektir. Şimdilik mock data kullanıyoruz.
  const recommendations = {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Destekli Öneri Motoru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">En İyi Adaylar</h3>
            <ul className="space-y-2">
              {recommendations.topCandidates.map((candidate) => (
                <li key={candidate.id} className="flex justify-between items-center">
                  <span>{candidate.name}</span>
                  <Badge variant="secondary">{candidate.score} puan</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mülakat Süreci İyileştirme Önerileri</h3>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.processImprovements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Aday Önerileri</h3>
            <ul className="space-y-2">
              {recommendations.candidateRecommendations.map((rec) => (
                <li key={rec.candidateId} className="flex justify-between items-center">
                  <span>{rec.name}</span>
                  <span className="text-sm text-gray-500">
                    {rec.currentInterview} → {rec.recommendedInterview}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">İşe Alım Tahminleri</h3>
            <ul className="space-y-2">
              {recommendations.hiringPredictions.map((prediction) => (
                <li key={prediction.candidateId} className="flex justify-between items-center">
                  <span>{prediction.name}</span>
                  <Badge variant="outline">{prediction.probability}% başarı olasılığı</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

