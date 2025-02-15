"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface InterviewStatisticsProps {
  interviewId: string
}

export function InterviewStatistics({ interviewId }: InterviewStatisticsProps) {
  const [statistics, setStatistics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStatistics({
          totalApplicants: 150,
          averageAIScore: 75,
          completionRate: 85,
          topPerformers: [
            { id: 1, name: "John Doe", score: 95 },
            { id: 2, name: "Jane Smith", score: 92 },
            { id: 3, name: "Bob Johnson", score: 90 },
          ],
        })
      } catch (error) {
        console.error("Error fetching statistics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Genel İstatistikler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span>Toplam Başvuru</span>
              <span>{statistics.totalApplicants}</span>
            </div>
            <Progress value={(statistics.totalApplicants / 200) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Ortalama AI Skoru</span>
              <span>{statistics.averageAIScore}%</span>
            </div>
            <Progress value={statistics.averageAIScore} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span>Tamamlanma Oranı</span>
              <span>{statistics.completionRate}%</span>
            </div>
            <Progress value={statistics.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>En İyi Performans Gösterenler</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {statistics.topPerformers.map((performer: any) => (
              <li key={performer.id} className="flex justify-between items-center">
                <span>{performer.name}</span>
                <span className="font-semibold">{performer.score}%</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/interviews/${interviewId}/applications`}>
            Tüm Başvuruları Gör
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

