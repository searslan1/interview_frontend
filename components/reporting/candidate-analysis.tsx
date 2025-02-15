"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CandidateAnalysisProps {
  filters: {
    dateRange: string
    interviewId: string
    candidateScoreMin: number
    experienceLevel: string
    analysisType: string
  }
}

export function CandidateAnalysis({ filters }: CandidateAnalysisProps) {
  // Bu veriler normalde API'den gelecektir. Şimdilik mock data kullanıyoruz.
  const analysisData = {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Destekli Aday Analizleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ortalama Mülakat Başarı Skoru</h3>
            <Progress value={analysisData.averageInterviewScore} className="w-full h-4" />
            <p className="text-right mt-1">{analysisData.averageInterviewScore}%</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Jest & Mimik Analizi</h3>
            <div className="space-y-2">
              {Object.entries(analysisData.gestureAnalysis).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="capitalize">{key}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress value={value} className="w-full h-2" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Duygu Analizi Eğrisi</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analysisData.emotionAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positive" stackId="a" fill="#4CAF50" />
                <Bar dataKey="neutral" stackId="a" fill="#FFC107" />
                <Bar dataKey="negative" stackId="a" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ses Tonu & Konuşma Analizi</h3>
            <div className="space-y-2">
              {Object.entries(analysisData.speechAnalysis).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="capitalize">{key}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress value={value} className="w-full h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

