"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Application, GeneralAIAnalysis } from "@/types/application"; // Application ve IGeneralAIAnalysis import edildi

interface AIReportProps {
  application: Application; // ✅ applicationId yerine tüm application objesini alacak
}

export function AIReport({ application }: AIReportProps) {
  // 🚀 GERÇEK VERİ BAĞLANTISI: generalAIAnalysis ve personalityTestResults çekiliyor
  const generalAnalysis = application.generalAIAnalysis || {};
  const personalityResults = application.personalityTestResults || {};

  // NOT: Backend IGeneralAIAnalysis yapınızda 'gestureAnalysis', 'speechAnalysis' 
  // veya 'personalityAnalysis' metin alanları direkt olarak yok. 
  // Bu yüzden mevcut Backend yapınıza uyan skorları kullanıyoruz.
  
  return (
    <div className="space-y-6">
      
      {/* 1. Genel Uyumluluk (Overall Score) */}
      <Card>
        <CardHeader>
          <CardTitle>Genel Uyumluluk Skoru</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={generalAnalysis.overallScore || 0} className="w-full" />
          <p className="mt-2 text-center text-lg font-bold">{generalAnalysis.overallScore ?? "N/A"}%</p>
        </CardContent>
      </Card>

      {/* 2. Kişilik Uyum Skoru (Personality Match Score) */}
      <Card>
        <CardHeader>
          <CardTitle>AI Kişilik Uyum Skoru</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={generalAnalysis.personalityMatchScore || 0} className="w-full" />
          <p className="mt-2 text-center text-lg font-bold">{generalAnalysis.personalityMatchScore ?? "N/A"}%</p>
        </CardContent>
      </Card>
      
      {/* 3. Güçlü Yönler (Strengths) */}
      <Card>
        <CardHeader>
          <CardTitle>Güçlü Yönler</CardTitle>
        </CardHeader>
        <CardContent>
          {(generalAnalysis.strengths && generalAnalysis.strengths.length > 0) ? (
            <ul className="list-disc list-inside space-y-1">
              {generalAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : (
            <p className="text-gray-500">Analiz sonuçlanmadı veya güçlü yön bulunamadı.</p>
          )}
        </CardContent>
      </Card>

      {/* 4. Geliştirilebilecek Alanlar (Improvement Areas) */}
      <Card>
        <CardHeader>
          <CardTitle>Geliştirilebilecek Alanlar & Öneriler</CardTitle>
        </CardHeader>
        <CardContent>
          {(generalAnalysis.areasForImprovement && generalAnalysis.areasForImprovement.length > 0) ? (
            <div className="space-y-4">
              {generalAnalysis.areasForImprovement.map((item, i) => (
                <div key={i} className="border-l-4 border-orange-400 pl-3">
                  <p className="font-semibold">{item.area}</p>
                  <p className="text-sm text-gray-600">{item.recommendedAction}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Analiz sonuçlanmadı veya geliştirme alanı bulunamadı.</p>
          )}
        </CardContent>
      </Card>

      {/* 5. Genel Öneri (Recommendation) */}
      <Card>
        <CardHeader>
          <CardTitle>Genel AI Önerisi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic text-gray-700">{generalAnalysis.recommendation || "Analizden genel bir öneri alınamadı."}</p>
        </CardContent>
      </Card>
    </div>
  )
}