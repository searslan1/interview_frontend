"use client"


import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface AICandidateAnalysisProps {
  candidateId: string
}

export function AICandidateAnalysis({ candidateId }: AICandidateAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const performAnalysis = async () => {
    setIsLoading(true)
    // Simüle edilmiş AI analizi
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAnalysis({
      overallScore: 85,
      technicalSkills: 90,
      communicationSkills: 80,
      problemSolving: 85,
      culturalFit: 85,
      strengths: ["Teknik bilgi", "Problem çözme yeteneği"],
      areasForImprovement: ["İletişim becerileri"],
    })
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Destekli Aday Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Button onClick={performAnalysis} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analiz Yapılıyor...
              </>
            ) : (
              "Analiz Yap"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Genel Skor</h3>
              <Progress value={analysis.overallScore} className="w-full" />
              <p className="text-sm text-right">{analysis.overallScore}/100</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Teknik Beceriler</h3>
                <Progress value={analysis.technicalSkills} className="w-full" />
                <p className="text-sm text-right">{analysis.technicalSkills}/100</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">İletişim Becerileri</h3>
                <Progress value={analysis.communicationSkills} className="w-full" />
                <p className="text-sm text-right">{analysis.communicationSkills}/100</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Problem Çözme</h3>
                <Progress value={analysis.problemSolving} className="w-full" />
                <p className="text-sm text-right">{analysis.problemSolving}/100</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kültürel Uyum</h3>
                <Progress value={analysis.culturalFit} className="w-full" />
                <p className="text-sm text-right">{analysis.culturalFit}/100</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Güçlü Yönler</h3>
              <ul className="list-disc list-inside">
                {analysis.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Geliştirilmesi Gereken Alanlar</h3>
              <ul className="list-disc list-inside">
                {analysis.areasForImprovement.map((area: string, index: number) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

