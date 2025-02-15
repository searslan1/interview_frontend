import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AIAnalysis {
  overallScore: number
  topPerformers: number
  improvementAreas: string[]
}

interface AIAnalysisCardProps {
  analysis: AIAnalysis | undefined
}

export function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  if (!analysis) {
    return (
      <Card>
        <CardContent>Veri yükleniyor...</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analiz Özeti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Genel Performans Skoru</h3>
            <Progress value={analysis.overallScore} className="w-full" />
            <p className="text-sm text-gray-500 mt-1">{analysis.overallScore}%</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">En İyi Performans Gösterenler</h3>
            <p className="text-2xl font-bold">{analysis.topPerformers}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Gelişim Alanları</h3>
            <ul className="list-disc list-inside">
              {analysis.improvementAreas.map((area, index) => (
                <li key={index} className="text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

