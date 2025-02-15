"use client"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VisualizationsAndGraphsProps {
  filters: {
    dateRange: string
    interviewId: string
    candidateScoreMin: number
    experienceLevel: string
    analysisType: string
  }
}

export function VisualizationsAndGraphs({ filters }: VisualizationsAndGraphsProps) {
  // Bu veriler normalde API'den gelecektir. Şimdilik mock data kullanıyoruz.
  const data = {
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
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Görselleştirmeler ve Grafikler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{/* Grafikler */}</div>
        </CardContent>
      </Card>
    </div>
  )
}

