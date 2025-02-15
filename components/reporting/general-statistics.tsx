"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface GeneralStatisticsProps {
  filters: {
    dateRange: string
    interviewId: string
    candidateScoreMin: number
    experienceLevel: string
    analysisType: string
  }
}

export function GeneralStatistics({ filters }: GeneralStatisticsProps) {
  // Bu veriler normalde API'den gelecektir. Şimdilik mock data kullanıyoruz.
  const stats = {
    totalInterviews: 1234,
    totalApplications: 5678,
    averageCandidateScore: 78,
    popularInterviews: [
      { id: 1, name: "Yazılım Geliştirici", applications: 234 },
      { id: 2, name: "Ürün Yöneticisi", applications: 189 },
      { id: 3, name: "Veri Bilimci", applications: 156 },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Mülakat ve Başvuru İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Toplam Mülakat Sayısı</h3>
            <p className="text-3xl font-bold">{stats.totalInterviews}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Toplam Başvuru Sayısı</h3>
            <p className="text-3xl font-bold">{stats.totalApplications}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Ortalama Aday Uyumluluk Puanı</h3>
            <Progress value={stats.averageCandidateScore} className="w-full h-4" />
            <p className="text-right mt-1">{stats.averageCandidateScore}%</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">En Çok Başvuru Alan Mülakatlar</h3>
            <ul className="space-y-2">
              {stats.popularInterviews.map((interview) => (
                <li key={interview.id} className="flex justify-between items-center">
                  <span>{interview.name}</span>
                  <span className="font-semibold">{interview.applications} başvuru</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

