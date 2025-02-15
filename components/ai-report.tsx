"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AIReportProps {
  applicationId: number
}

export function AIReport({ applicationId }: AIReportProps) {
  // Mock AI report data
  const aiReport = {
    overallCompatibility: 85,
    personalityAnalysis: "INTJ - Mimar",
    gestureAnalysis: {
      confidence: 80,
      excitement: 70,
      stress: 30,
    },
    speechAnalysis: {
      fluency: 90,
      confidence: 85,
      persuasiveness: 75,
    },
    technicalKnowledge: 88,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genel Uyumluluk</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={aiReport.overallCompatibility} className="w-full" />
          <p className="mt-2 text-center">{aiReport.overallCompatibility}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kişilik Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{aiReport.personalityAnalysis}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jest ve Mimik Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p>Özgüven</p>
              <Progress value={aiReport.gestureAnalysis.confidence} className="w-full" />
            </div>
            <div>
              <p>Heyecan</p>
              <Progress value={aiReport.gestureAnalysis.excitement} className="w-full" />
            </div>
            <div>
              <p>Stres</p>
              <Progress value={aiReport.gestureAnalysis.stress} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Konuşma Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p>Akıcılık</p>
              <Progress value={aiReport.speechAnalysis.fluency} className="w-full" />
            </div>
            <div>
              <p>Özgüven</p>
              <Progress value={aiReport.speechAnalysis.confidence} className="w-full" />
            </div>
            <div>
              <p>İkna Kabiliyeti</p>
              <Progress value={aiReport.speechAnalysis.persuasiveness} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teknik Bilgi Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={aiReport.technicalKnowledge} className="w-full" />
          <p className="mt-2 text-center">{aiReport.technicalKnowledge}%</p>
        </CardContent>
      </Card>
    </div>
  )
}

